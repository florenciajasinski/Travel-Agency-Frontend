import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useCreateCityMutation, useUpdateCityMutation } from "@/services";
import { getCitySchema } from "@/services/cities/schemas";
import type { City } from "@/services/cities/types";
import type { CreateCity, UpdateCity } from "@/services/cities/types";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertCityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  city?: City;
};

export const UpsertCityDialog = ({ city, isOpen, onOpenChange }: UpsertCityDialogProps) => {
  const { t } = useTranslation();

  const { isPending: isCreating, mutate: createCity } = useCreateCityMutation();
  const { isPending: isUpdating, mutate: updateCity } = useUpdateCityMutation();

  const isNewCity = !city;
  const isPending = isUpdating || isCreating;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(getCitySchema()),
    values: {
      name: city?.name ?? "",
      incomingFlights: city?.incomingFlights ?? 0,
      outgoingFlights: city?.outgoingFlights ?? 0,
    },
  });

  const onSubmit: SubmitHandler<CreateCity | UpdateCity> = (data) => {
    if (isNewCity) {
      return createCity(data, {
        onSuccess: () => {
          toast.success(t("cities.create.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<CreateCity>(error, setError, t("cities.create.error"));
        },
      });
    }

    return updateCity(
      { ...data, id: city.id },
      {
        onSuccess: () => {
          toast.success(t("cities.update.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<UpdateCity>(error, setError, t("cities.update.error"));
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }

    onOpenChange(open);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Content isDismissible={!isUpdating && !isCreating}>
        <Dialog.Header>
          <Dialog.Title>
            {isNewCity ? t("cities.create.title") : t("cities.update.title")}
          </Dialog.Title>

          <Dialog.Description>
            {isNewCity ? t("cities.create.description") : t("cities.update.description")}
          </Dialog.Description>
        </Dialog.Header>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t("form.name")}</Label>

            <Input {...register("name")} id="name" size="sm" />

            <ErrorMessage errorMessage={errors?.name?.message} />
          </div>

          <Dialog.Footer>
            <Dialog.Close disabled={isPending} asChild>
              <Button variant="outlined">{t("buttons.cancel")}</Button>
            </Dialog.Close>

            <Button isLoading={isPending} type="submit">
              {isNewCity ? t("buttons.create") : t("buttons.update")}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
