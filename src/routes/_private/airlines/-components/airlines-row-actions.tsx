import { useState } from "react";
import type { Row } from "@tanstack/react-table";

import { Button, DropdownMenu, Icons } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { Airline } from "@/services/airlines/types";
import { DeleteAirlineDialog } from "./delete-airline-dialog";
import { UpsertAirlineDialog } from "./upsert-airlines-dialog";

type AirlinesRowActionsProps = {
  row: Row<Airline>;
};

export const AirlinesRowActions = ({ row }: AirlinesRowActionsProps) => {
  const { t } = useTranslation();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showUpsertDialog, setShowUpsertDialog] = useState(false);

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
              return setShowUpsertDialog(true);
            }}
          >
            {t("buttons.update")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <UpsertAirlineDialog
        airline={row.original}
        isOpen={showUpsertDialog}
        onOpenChange={setShowUpsertDialog}
      />

      <DeleteAirlineDialog
        airline={row.original}
        isOpen={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
      />
    </>
  );
};
