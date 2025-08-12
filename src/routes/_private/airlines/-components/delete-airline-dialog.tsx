import { Button, Dialog, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAirlinesDeleteMutation } from "@/services";
import type { Airline } from "@/services/airlines/types";

type DeleteAirlineDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  airline: Airline;
};

export const DeleteAirlineDialog = ({
  airline,
  isOpen,
  onOpenChange,
}: DeleteAirlineDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate: deleteAirline } = useAirlinesDeleteMutation();

  const handleDelete = async () => {
    deleteAirline(airline.id, {
      onSuccess: () => {
        toast.success(t("airlines.table.columns.actions.deletionSuccess", { name: airline.name }));
      },
      onError: () => {
        toast.error(t("airlines.table.columns.actions.deletionError", { name: airline.name }));
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
          <Dialog.Title>{t("airlines.table.columns.actions.areYouAbsolutelySure")}</Dialog.Title>

          <Dialog.Description>
            {t("airlines.table.columns.actions.thisActionCantBeUndone", { name: airline.name })}
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
