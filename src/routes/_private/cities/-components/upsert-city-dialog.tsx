import { useEffect } from "react";
import { useRef } from "react";
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
import type { City, CreateCity, UpdateCity } from "@/services/cities/types";
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

  const cityId = currentCity?.id?.toString() ?? "";
  const { data: cityAirlines = [], isLoading: isLoadingCityAirlines } = useCityAirlinesQuery(
    { cityId },
    { enabled: !!currentCity },
  );
  console.log("🟠 useCityAirlinesQuery enabled:", !!city);
  const cityAirlineIds = Array.isArray(cityAirlines)
    ? cityAirlines.map((a: { id: number }) => {
        return a.id.toString();
      })
    : (cityAirlines.data ?? []).map((a: { id: number }) => {
        return a.id.toString();
      });

  console.log("\uD83D\uDD0D Airlines data:", airlinesData);
  console.log("\uD83D\uDD0D Airlines array:", airlines);
  console.log("\uD83D\uDD0D City prop:", city);
  console.log("\uD83D\uDD0D Current city:", currentCity);
  console.log("\uD83D\uDD0D City airline IDs (from API):", cityAirlineIds);

  const { isPending: isCreating, mutate: createCity } = useCreateCityMutation();
  const { isPending: isUpdating, mutate: updateCity } = useUpdateCityMutation();

  const isNewCity = !currentCity;
  const isPending = isUpdating || isCreating;

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<CreateCity | UpdateCity>({
    mode: "onTouched",
    resolver: zodResolver(getCitySchema()),
    defaultValues: {
      name: currentCity?.name ?? "",
      airlineIds: cityAirlineIds.map((id) => {
        return Number(id);
      }),
    },
  });

  const watchedValues = watch();
  console.log("\uD83D\uDD0D Form values:", watchedValues);

  useEffect(() => {
    if (isOpen && currentCity && !hasResetRef.current) {
      const airlineIds = (
        Array.isArray(cityAirlines) ? cityAirlines : (cityAirlines.data ?? [])
      ).map((a: { id: number }) => {
        return a.id.toString();
      });
      console.log("🔍 Setting form values - airlineIds (from query):", airlineIds);

      reset({
        name: currentCity?.name ?? "",
        airlineIds: airlineIds.map((id) => {
          return Number(id);
        }),
      });

      hasResetRef.current = true;
    }

    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentCity, cityAirlines, reset]);

  const onSubmit: SubmitHandler<CreateCity | UpdateCity> = (data) => {
    console.log("\uD83D\uDD0D Form submit data:", data);

    const payload = {
      ...data,
      airlineIds: data.airlineIds ?? [],
    };

    console.log("\uD83D\uDD0D Submit payload:", payload);

    if (isNewCity) {
      return createCity(payload as CreateCity, {
        onSuccess: () => {
          toast.success(t("cities.create.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          console.error("\uD83D\uDD0D Create city error:", error);
          handleAxiosFieldErrors<CreateCity>(error, setError, t("cities.create.error"));
        },
      });
    }

    return updateCity(
      { ...(payload as UpdateCity), id: currentCity.id },
      {
        onSuccess: () => {
          toast.success(t("cities.update.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          console.error("\uD83D\uDD0D Update city error:", error);
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
            <Input {...register("name" as const)} id="name" size="sm" />
            <ErrorMessage errorMessage={errors?.name?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("form.airlines")}</Label>

            {isLoadingAirlines || isLoadingCityAirlines ? (
              <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
            ) : (
              <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded border p-2">
                {airlines.map((airline) => {
                  const isChecked = watchedValues.airlineIds?.includes(airline.id);
                  console.log(
                    `\uD83D\uDD0D Airline ${airline.name} (${airline.id}) - Checked: ${isChecked}`,
                  );

                  return (
                    <label className="flex items-center gap-2" key={airline.id}>
                      <input
                        type="checkbox"
                        value={airline.id.toString()}
                        {...register("airlineIds" as const)}
                        defaultChecked={isChecked}
                      />
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
