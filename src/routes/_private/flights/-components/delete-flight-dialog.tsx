import { Button, Dialog, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useFlightsDeleteMutation } from "@/services";
import type { Flight } from "@/services/flights/types";

type DeleteFlightDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flight: Flight;
};

export const DeleteFlightDialog = ({ flight, isOpen, onOpenChange }: DeleteFlightDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate: deleteFlight } = useFlightsDeleteMutation();

  const handleDelete = async () => {
    deleteFlight(flight.id, {
      onSuccess: () => {
        toast.success(t("flights.table.columns.actions.deletionSuccess", { name: flight.id }));
      },
      onError: () => {
        toast.error(t("flights.table.columns.actions.deletionError", { name: flight.id }));
      },
      onSettled: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={isOpen}>
      <Dialog.Content isDismissible={!isPending}>
        <Dialog.Header>
          <Dialog.Title>{t("flights.table.columns.actions.areYouAbsolutelySure")}</Dialog.Title>

          <Dialog.Description>
            {t("flights.table.columns.actions.thisActionCantBeUndone", { name: flight.id })}
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Footer>
          <Dialog.Close disabled={isPending} asChild>
            <Button variant="outlined">{t("buttons.cancel")}</Button>
          </Dialog.Close>

          <Button isLoading={isPending} onClick={handleDelete} type="submit">
            {t("buttons.confirm")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
