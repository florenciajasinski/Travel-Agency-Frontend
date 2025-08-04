import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAllAirlinesQuery } from "@/services/airlines/actions";
import { useCreateCityMutation, useUpdateCityMutation } from "@/services/cities/actions";
import { getCitySchema } from "@/services/cities/schemas";
import type { City, CreateCity, UpdateCity } from "@/services/cities/types";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertCityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  city?: City;
};

export const UpsertCityDialog = ({ city, isOpen, onOpenChange }: UpsertCityDialogProps) => {
  const { t } = useTranslation();

  const { data: airlinesData, isLoading: isLoadingAirlines } = useAllAirlinesQuery();
  const airlines = Array.isArray(airlinesData) ? airlinesData : [];

  const { isPending: isCreating, mutate: createCity } = useCreateCityMutation();
  const { isPending: isUpdating, mutate: updateCity } = useUpdateCityMutation();

  const isNewCity = !city;
  const isPending = isUpdating || isCreating;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<CreateCity | UpdateCity>({
    mode: "onTouched",
    resolver: zodResolver(getCitySchema()),
    defaultValues: {
      name: city?.name ?? "",
      airlineIds:
        (city as City | undefined)?.airlines?.map((a) => {
          return a.id;
        }) ?? [],
    },
  });

  const onSubmit: SubmitHandler<CreateCity | UpdateCity> = (data) => {
    const payload = {
      ...data,
      airlineIds: data.airlineIds ?? [],
    };

    if (isNewCity) {
      return createCity(payload as CreateCity, {
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
      { ...(payload as UpdateCity), id: city.id },
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
      <Dialog.Content isDismissible={!isPending}>
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
          <div className="flex flex-col gap-2">
            <Label>{t("form.airlines")}</Label>

            {isLoadingAirlines ? (
              <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
            ) : (
              <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded border p-2">
                {airlines.map((airline) => {
                  return (
                    <label className="flex items-center gap-2" key={airline.id}>
                      <input type="checkbox" value={airline.id} {...register("airlineIds")} />
                      {airline.name}
                    </label>
                  );
                })}
              </div>
            )}
            <ErrorMessage errorMessage={errors?.airlineIds?.message} />
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
