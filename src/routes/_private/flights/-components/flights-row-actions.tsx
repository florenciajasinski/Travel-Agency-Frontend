import { useState } from "react";
import type { Row } from "@tanstack/react-table";

import { Button, DropdownMenu, Icons } from "@/components/ui";
import { useTranslation } from "@/i18n";
import type { Flight } from "@/services/flights/types";
import { DeleteFlightDialog } from "./delete-flight-dialog";
import { UpsertFlightDialog } from "./upsert-flights-dialog";

type FlightsRowActionsProps = {
  row: Row<Flight>;
};

export const FlightsRowActions = ({ row }: FlightsRowActionsProps) => {
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

      <UpsertFlightDialog
        flight={row.original}
        isOpen={showUpsertDialog}
        onOpenChange={setShowUpsertDialog}
      />

      <DeleteFlightDialog
        flight={row.original}
        isOpen={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
      />
    </>
  );
};
