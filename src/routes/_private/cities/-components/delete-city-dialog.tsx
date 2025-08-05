import { Button, Dialog, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useCitiesDeleteMutation } from "@/services";
import type { City } from "@/services/cities/types";

type DeleteCityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  city: City;
};

export const DeleteCityDialog = ({ city, isOpen, onOpenChange }: DeleteCityDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate: deleteCity } = useCitiesDeleteMutation();

  const handleDelete = async () => {
    deleteCity(city.id, {
      onSuccess: () => {
        toast.success(t("cities.table.columns.deletionSuccess", { name: city.name }));
      },
      onError: () => {
        toast.error(t("cities.table.columns.deletionError", { name: city.name }));
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
          <Dialog.Title>{t("cities.table.columns.areYouAbsolutelySure")}</Dialog.Title>

          <Dialog.Description>
            {t("cities.table.columns.thisActionCantBeUndone", { name: city.name })}
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
