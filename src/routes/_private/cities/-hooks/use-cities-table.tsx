import { useMemo } from "react";

import { createColumnHelper, useTable, type UseTableProps } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { City } from "@/services/cities/types";
import { CityRowActions } from "../-components/cities-row-actions";

export const useCitiesTable = ({ data = [], ...props }: Omit<UseTableProps<City>, "columns">) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<City>();

    return [
      columnHelper.accessor("id", {
        meta: { stringifiedHeader: t("cities.table.columns.id") },
        header: t("cities.table.columns.id"),
      }),
      columnHelper.accessor("name", {
        meta: { stringifiedHeader: t("cities.table.columns.name") },
        header: t("cities.table.columns.name"),
      }),
      columnHelper.accessor("incomingFlights", {
        meta: { stringifiedHeader: t("cities.table.columns.incomingFlights") },
        header: t("cities.table.columns.incomingFlights"),
      }),
      columnHelper.accessor("outgoingFlights", {
        meta: { stringifiedHeader: t("cities.table.columns.outgoingFlights") },
        header: t("cities.table.columns.outgoingFlights"),
      }),
      columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return <CityRowActions row={row} />;
        },
      }),
    ];
  }, [t]);

  return useTable({ columns, data, ...props });
};
