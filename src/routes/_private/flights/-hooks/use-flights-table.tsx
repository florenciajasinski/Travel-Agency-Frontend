import { useMemo } from "react";

import { createColumnHelper, useTable, type UseTableProps } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { Flight } from "@/services/flights/types";
import { FlightsRowActions } from "../-components/flights-row-actions";

export const useFlightsTable = ({
  data = [],
  ...props
}: Omit<UseTableProps<Flight>, "columns">) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Flight>();

    return [
      columnHelper.accessor("id", {
        meta: { stringifiedHeader: t("flights.table.columns.id") },
        header: t("flights.table.columns.id"),
      }),
      columnHelper.accessor("airline", {
        meta: { stringifiedHeader: t("flights.table.columns.airline") },
        header: t("flights.table.columns.airline"),
      }),
      columnHelper.accessor("departureCity", {
        meta: { stringifiedHeader: t("flights.table.columns.departureCity") },
        header: t("flights.table.columns.departureCity"),
      }),
      columnHelper.accessor("arrivalCity", {
        meta: { stringifiedHeader: t("flights.table.columns.arrivalCity") },
        header: t("flights.table.columns.arrivalCity"),
      }),
      columnHelper.accessor("departureTime", {
        meta: { stringifiedHeader: t("flights.table.columns.departureTime") },
        header: t("flights.table.columns.departureTime"),
      }),
      columnHelper.accessor("arrivalTime", {
        meta: { stringifiedHeader: t("flights.table.columns.arrivalTime") },
        header: t("flights.table.columns.arrivalTime"),
      }),

      columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return <FlightsRowActions row={row} />;
        },
      }),
    ];
  }, [t]);

  return useTable({ columns, data, ...props });
};
