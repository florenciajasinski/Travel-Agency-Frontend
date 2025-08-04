import { useState } from "react";
import type { Row } from "@tanstack/react-table";

import { Button, DropdownMenu, Icons } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { City } from "@/services/cities/types";
import { DeleteCityDialog } from "./delete-city-dialog";
import { UpsertCityDialog } from "./upsert-city-dialog";

type CityRowActionsProps = {
  row: Row<City>;
};

export const CityRowActions = ({ row }: CityRowActionsProps) => {
  const { t } = useTranslation();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="flex justify-end">
            <Button className="size-8" variant="plainText">
              <Icons.MoreHorizontal />
            </Button>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            onClick={() => {
              return setShowConfirmDelete(true);
            }}
          >
            {t("buttons.delete")}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              return setShowUpdateDialog(true);
            }}
          >
            {t("buttons.update")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <UpsertCityDialog
        city={row.original}
        isOpen={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
      />

      <DeleteCityDialog
        city={row.original}
        isOpen={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
      />
    </>
  );
};
