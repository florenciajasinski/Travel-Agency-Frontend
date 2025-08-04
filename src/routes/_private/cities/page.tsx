import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Button, DataTable } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import {
  paginationValidationWithDefaults,
  searchTextValidation,
  useDebounce,
  usePagination,
  useSearchText,
} from "@/hooks";
import { useTranslation } from "@/i18n";
import { useCitiesListQuery } from "@/services/cities/actions";
import { CITY_FILTER_KEYS } from "@/services/cities/constants";
import { UpsertCityDialog } from "./-components/upsert-city-dialog";
import { useCitiesTable } from "./-hooks/use-cities-table";

const CityPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [airlineFilter, setAirlineFilter] = useState("");

  const {
    actions: { changePage },
    page,
    pageIndex,
  } = usePagination(Route.id);

  const { searchText } = useSearchText(Route.id);
  const debouncedSearchText = useDebounce(searchText, 500);
  const { t } = useTranslation();

  const {
    data: citiesListData,
    isLoading,
    isSuccess,
  } = useCitiesListQuery({
    filter: {
      [CITY_FILTER_KEYS.AIRLINE]: debouncedSearchText,
    },
    page,
  });

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

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <h1>{t("cities.title")}</h1>

        <DataTable
          actions={
            <div className="flex gap-2">
              <select
                className="rounded border px-3 py-2 text-sm"
                onChange={(e) => {
                  setAirlineFilter(e.target.value);
                }}
                value={airlineFilter}
              >
                <option value="">{t("airlines.all")}</option>
                {/*{citiesListData?.included?.airlines?.map((a) => (
                  //<option key={a.id} value={a.id}>
                    {a.name}
                  //</option>
                ))}*/}
              </select>
              <Button
                onClick={() => {
                  changePage({ pageIndex: 0 });
                }}
              >
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
          path={Route.id}
          table={table}
          withSearch={false}
        />
      </div>

      <UpsertCityDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
};

export const Route = createFileRoute("/_private/cities/")({
  component: CityPage,
  validateSearch: z.object({
    ...searchTextValidation.shape,
    ...paginationValidationWithDefaults.shape,
  }),
});
