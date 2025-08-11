import { useMemo } from "react";

import { createColumnHelper, useTable, type UseTableProps } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { Airline } from "@/services/airlines/types";
import { AirlinesRowActions } from "../-components/airlines-row-actions";

export const useAirlinesTable = ({
  data = [],
  ...props
}: Omit<UseTableProps<Airline>, "columns">) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Airline>();

    return [
      columnHelper.accessor("id", {
        meta: { stringifiedHeader: t("airlines.table.columns.id") },
        header: t("airlines.table.columns.id"),
      }),
      columnHelper.accessor("name", {
        meta: { stringifiedHeader: t("airlines.table.columns.name") },
        header: t("airlines.table.columns.name"),
      }),
      columnHelper.accessor("description", {
        meta: { stringifiedHeader: t("airlines.table.columns.description") },
        header: t("airlines.table.columns.description"),
      }),
      columnHelper.accessor("flightsCount", {
        meta: { stringifiedHeader: t("airlines.table.columns.flightsCount") },
        header: t("airlines.table.columns.flightsCount"),
      }),
      columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return <AirlinesRowActions row={row} />;
        },
      }),
    ];
  }, [t]);

  return useTable({ columns, data, ...props });
};
