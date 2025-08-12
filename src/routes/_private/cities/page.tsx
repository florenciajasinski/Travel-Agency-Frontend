import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Button, DataTable } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { paginationValidationWithDefaults, usePagination } from "@/hooks";
import { useTranslation } from "@/i18n";
import { useAllAirlinesQuery } from "@/services/airlines/actions";
import { useAirlineCitiesQuery, useCitiesListQuery } from "@/services/cities/actions";
import { UpsertCityDialog } from "./-components/upsert-city-dialog";
import { useCitiesTable } from "./-hooks/use-cities-table";

const CityPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [airlineFilter, setAirlineFilter] = useState("");
  const [appliedAirlineFilter, setAppliedAirlineFilter] = useState("");

  const {
    actions: { changePage },
    page,
    pageIndex,
  } = usePagination(Route.id);

  const { t } = useTranslation();

  const {
    data: allCitiesData,
    isLoading: isLoadingAllCities,
    isSuccess: isSuccessAllCities,
  } = useCitiesListQuery({ page }, { enabled: !appliedAirlineFilter });

  const {
    data: airlineCitiesData,
    isLoading: isLoadingAirlineCities,
    isSuccess: isSuccessAirlineCities,
  } = useAirlineCitiesQuery(
    { airlineId: appliedAirlineFilter, page },
    { enabled: !!appliedAirlineFilter },
  );

  const { data: airlinesData, isLoading: isLoadingAirlines } = useAllAirlinesQuery();

  const airlines = Array.isArray(airlinesData) ? airlinesData : [];

  const citiesListData = appliedAirlineFilter ? airlineCitiesData : allCitiesData;
  const isLoading = appliedAirlineFilter ? isLoadingAirlineCities : isLoadingAllCities;
  const isSuccess = appliedAirlineFilter ? isSuccessAirlineCities : isSuccessAllCities;

  const lastPage = citiesListData?.meta?.lastPage;
  const pageSize = citiesListData?.meta?.perPage ?? DEFAULT_PAGE_SIZE;
  const totalItems = citiesListData?.meta?.total ?? 0;

  useEffect(() => {
    if (isSuccess && lastPage && page > lastPage) {
      changePage({ pageIndex: lastPage - 1 });
    }
  }, [changePage, isSuccess, lastPage, page]);

  const table = useCitiesTable({
    data: citiesListData?.data ?? [],
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (
      updater:
        | ((pagination: { pageIndex: number; pageSize: number }) => {
            pageIndex: number;
            pageSize: number;
          })
        | { pageIndex: number; pageSize: number },
    ) => {
      if (typeof updater === "function") {
        changePage(updater({ pageIndex, pageSize }));
      }
    },
    pageCount: lastPage,
    meta: { totalItems },
  });

  const handleApplyFilter = () => {
    setAppliedAirlineFilter(airlineFilter);
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
                disabled={isLoadingAirlines}
                onChange={(e) => {
                  setAirlineFilter(e.target.value);
                }}
                value={airlineFilter}
              >
                <option value="">
                  {isLoadingAirlines ? t("common.loading") : t("airlines.all")}
                </option>
                {airlines.map((airline) => {
                  return (
                    <option key={airline.id} value={airline.id.toString()}>
                      {airline.name}
                    </option>
                  );
                })}
              </select>

              <Button disabled={isLoadingAirlines} onClick={handleApplyFilter} variant="elevated">
                {t("common.filter")}
              </Button>

              <Button
                onClick={() => {
                  setIsCreateDialogOpen(true);
                }}
                variant="elevated"
              >
                {t("cities.create.title")}
              </Button>
            </div>
          }
          isLoading={isLoading}
          table={table}
        />
      </div>

      <UpsertCityDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
};

export const Route = createFileRoute("/_private/cities/")({
  component: CityPage,
  validateSearch: z.object({
    ...paginationValidationWithDefaults.shape,
  }),
});
