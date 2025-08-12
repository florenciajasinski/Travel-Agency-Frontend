import { Button, Dialog, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useFlightsDeleteMutation } from "@/services";

type DeleteFlightDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flightId: number;
};

export const DeleteFlightDialog = ({ flightId, isOpen, onOpenChange }: DeleteFlightDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate: deleteFlight } = useFlightsDeleteMutation();

  const handleDelete = async () => {
    deleteFlight(flightId, {
      onSuccess: () => {
        toast.success(t("flights.table.columns.actions.deletionSuccess", { name: flightId }));
      },
      onError: () => {
        toast.error(t("flights.table.columns.actions.deletionError", { name: flightId }));
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
            {t("flights.table.columns.actions.thisActionCantBeUndone", { name: flightId })}
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
