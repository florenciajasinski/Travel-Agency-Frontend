import { useEffect, useState } from "react";
import { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Button, DataTable } from "@/components/ui";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { paginationValidationWithDefaults, usePagination } from "@/hooks";
import { useTranslation } from "@/i18n";
import { useFlightsListQuery } from "@/services/flights/actions";
import { getList } from "@/services/schemas";
import { UpsertFlightDialog } from "./-components/upsert-flights-dialog";
import { useFlightsTable } from "./-hooks/use-flights-table";

const FlightPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    actions: { changePage },
    page,
    pageIndex,
  } = usePagination(Route.id);

  const { t } = useTranslation();

  const {
    data: allFlightData,
    isLoading: isLoadingAllFlights,
    isSuccess: isSuccessAllFlights,
  } = useFlightsListQuery({ page }, { enabled: true });

  const flightListData = allFlightData;
  const isLoading = isLoadingAllFlights;
  const isSuccess = isSuccessAllFlights;

  const { lastPage, pageSize, totalItems } = getList(flightListData, DEFAULT_PAGE_SIZE);
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

  const table = useFlightsTable({
    data: flightListData?.data ?? [],
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: handlePaginationChange,
    pageCount: lastPage,
    meta: { totalItems },
  });

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <DataTable
          actions={
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsCreateDialogOpen(true);
                }}
                variant="elevated"
              >
                {t("flights.create.title")}
              </Button>
            </div>
          }
          isLoading={isLoading}
          table={table}
        />
      </div>

      <UpsertFlightDialog isOpen={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
};

export const Route = createFileRoute("/_private/flights/")({
  component: FlightPage,
  validateSearch: z.object({
    ...paginationValidationWithDefaults.shape,
  }),
});
