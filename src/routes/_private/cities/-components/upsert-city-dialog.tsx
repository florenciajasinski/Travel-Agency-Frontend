import { useEffect, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAllAirlinesQuery } from "@/services/airlines/actions";
import {
  useCityAirlinesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
} from "@/services/cities/actions";
import { getCitySchema } from "@/services/cities/schemas";
import type { City, CreateCityPayload, UpdateCityPayload } from "@/services/cities/types";
import type { UpsertCityFormData } from "@/services/cities/types";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertCityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  city?: City;
};

export const UpsertCityDialog = ({ city, isOpen, onOpenChange }: UpsertCityDialogProps) => {
  const { t } = useTranslation();
  const hasResetRef = useRef(false);

  const { data: airlinesData, isLoading: isLoadingAirlines } = useAllAirlinesQuery();
  const airlines = Array.isArray(airlinesData) ? airlinesData : [];

  const currentCity = city;
  const isNewCity = !currentCity;

  const cityId = currentCity?.id?.toString() ?? "";
  const { data: cityAirlines = [], isLoading: isLoadingCityAirlines } = useCityAirlinesQuery(
    { cityId },
    { enabled: !!currentCity },
  );

  const handleCreate = (payload: CreateCityPayload) => {
    createCity(payload, {
      onSuccess: () => {
        toast.success(t("cities.create.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<CreateCityPayload>(error, setError, t("cities.create.error"));
      },
    });
  };

  const handleUpdate = (payload: UpdateCityPayload) => {
    updateCity(payload, {
      onSuccess: () => {
        toast.success(t("cities.update.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<UpdateCityPayload>(error, setError, t("cities.update.error"));
      },
    });
  };

  const cityAirlineIds = Array.isArray(cityAirlines)
    ? cityAirlines.map((a: { id: number }) => {
        return a.id.toString();
      })
    : (cityAirlines.data ?? []).map((a: { id: number }) => {
        return a.id.toString();
      });

  const { isPending: isCreating, mutate: createCity } = useCreateCityMutation();
  const { isPending: isUpdating, mutate: updateCity } = useUpdateCityMutation();
  const isPending = isUpdating || isCreating;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<UpsertCityFormData>({
    mode: "onTouched",
    resolver: zodResolver(getCitySchema()),
    defaultValues: {
      name: currentCity?.name ?? "",
      airline_ids: isNewCity ? undefined : cityAirlineIds.map(Number),
      incomingFlights: currentCity?.incomingFlights ?? 0,
      outgoingFlights: currentCity?.outgoingFlights ?? 0,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen && currentCity && !hasResetRef.current) {
      reset({
        name: currentCity?.name ?? "",
        airline_ids: isNewCity ? undefined : cityAirlineIds.map(Number),
      });
      hasResetRef.current = true;
    }

    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentCity, cityAirlines, cityAirlineIds, isNewCity, reset]);

  const onSubmit: SubmitHandler<UpsertCityFormData> = (data) => {
    const payload = {
      name: data.name,
      ...(isNewCity ? {} : { airline_ids: data.airline_ids?.map(Number) ?? [] }),
    };

    if (isNewCity) {
      return handleCreate(payload);
    }

    return handleUpdate({ ...payload, id: currentCity.id });
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

          {!isNewCity && (
            <div className="flex flex-col gap-2">
              <Label>{t("form.airlines")}</Label>

              {isLoadingAirlines || isLoadingCityAirlines ? (
                <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
              ) : (
                <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded border p-2">
                  {airlines.map((airline) => {
                    const isChecked = watchedValues.airline_ids?.includes(airline.id);

                    return (
                      <label className="flex items-center gap-2" key={airline.id}>
                        <input
                          type="checkbox"
                          value={airline.id.toString()}
                          {...register("airline_ids")}
                          defaultChecked={isChecked}
                        />
                        {airline.name}
                      </label>
                    );
                  })}
                </div>
              )}
              <ErrorMessage errorMessage={errors?.airline_ids?.message} />
            </div>
          )}

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
