import { useEffect, useState } from "react";
import { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Button, DataTable } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { paginationValidationWithDefaults, usePagination } from "@/hooks";
import { useTranslation } from "@/i18n";
import { useAirlinesListQuery } from "@/services/airlines/actions";
import { useCityAirlinesQuery } from "@/services/cities/actions";
import { useAllCitiesQuery } from "@/services/cities/actions";
import { getList } from "@/services/schemas";
import { UpsertAirlineDialog } from "./-components/upsert-airlines-dialog";
import { useAirlinesTable } from "./-hooks/use-airlines-table";

const AirlinePage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [appliedCityFilter, setAppliedCityFilter] = useState("");

  const {
    actions: { changePage },
    page,
    pageIndex,
  } = usePagination(Route.id);

  const { t } = useTranslation();

  const {
    data: allAirlineData,
    isLoading: isLoadingAllAirlines,
    isSuccess: isSuccessAllAirlines,
  } = useAirlinesListQuery({ page }, { enabled: !appliedCityFilter });

  const {
    data: cityAirlinesData,
    isLoading: isLoadingCityAirlines,
    isSuccess: isSuccessCityAirlines,
  } = useCityAirlinesQuery({ cityId: appliedCityFilter, page }, { enabled: !!appliedCityFilter });

  const { data: citiesData, isLoading: isLoadingCities } = useAllCitiesQuery();

  const cities = Array.isArray(citiesData) ? citiesData : [];

  const airlineListData = appliedCityFilter ? cityAirlinesData : allAirlineData;
  const isLoading = appliedCityFilter ? isLoadingCityAirlines : isLoadingAllAirlines;
  const isSuccess = appliedCityFilter ? isSuccessCityAirlines : isSuccessAllAirlines;

  const { lastPage, pageSize, totalItems } = getList(airlineListData, DEFAULT_PAGE_SIZE);
  type Pagination = { pageIndex: number; pageSize: number };
  const handlePaginationChange = useCallback(
    (updater: Pagination | ((p: Pagination) => Pagination)) => {
      const current: Pagination = { pageIndex, pageSize };
      const next = typeof updater === "function" ? updater(current) : updater;
      changePage(next);
    },
    [changePage, pageIndex, pageSize],
  );
  useEffect(() => {
    if (isSuccess && lastPage && page > lastPage) {
      changePage({ pageIndex: lastPage - 1 });
    }
  }, [changePage, isSuccess, lastPage, page]);

  const table = useAirlinesTable({
    data: airlineListData?.data ?? [],
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: handlePaginationChange,
    pageCount: lastPage,
    meta: { totalItems },
  });

  const handleApplyFilter = () => {
    setAppliedCityFilter(cityFilter);
    changePage({ pageIndex: 0 });
  };

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <DataTable
          actions={
            <div className="flex gap-2">
              <select
                className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                disabled={isLoadingCities}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                }}
                value={cityFilter}
              >
                <option value="">{isLoadingCities ? t("common.loading") : t("cities.all")}</option>
                {cities.map(({ id, name }) => {
                  return (
                    <option key={id} value={id.toString()}>
                      {name}
                    </option>
                  );
                })}
              </select>

              <Button disabled={isLoadingCities} onClick={handleApplyFilter} variant="elevated">
                {t("common.filter")}
              </Button>

              <Button
                onClick={() => {
                  setIsCreateDialogOpen(true);
                }}
                variant="elevated"
              >
                {t("airlines.create.title")}
              </Button>
            </div>
          }
          isLoading={isLoading}
          table={table}
        />
      </div>

      <UpsertAirlineDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
};

export const Route = createFileRoute("/_private/airlines/")({
  component: AirlinePage,
  validateSearch: z.object({
    ...paginationValidationWithDefaults.shape,
  }),
});
