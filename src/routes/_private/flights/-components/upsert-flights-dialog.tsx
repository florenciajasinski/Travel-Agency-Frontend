import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAllAirlinesQuery } from "@/services/airlines/actions";
import { useAirlineCitiesQuery } from "@/services/cities/actions";
import { useCreateFlightMutation, useUpdateFlightMutation } from "@/services/flights/actions";
import { getFlightSchema } from "@/services/flights/schemas";
import type { CreateFlight, Flight, UpdateFlight } from "@/services/flights/types";
import { handleAxiosFieldErrors } from "@/utils";

type UpsertFlightDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flight?: Flight;
};

export const UpsertFlightDialog = ({ flight, isOpen, onOpenChange }: UpsertFlightDialogProps) => {
  const { t } = useTranslation();
  const hasResetRef = useRef(false);

  const currentFlight = flight;
  const isNewFlight = !currentFlight;

  const { isPending: isCreating, mutate: createFlight } = useCreateFlightMutation();
  const { isPending: isUpdating, mutate: updateFlight } = useUpdateFlightMutation();
  const isPending = isUpdating || isCreating;

  const { data: airlinesData, isLoading: isLoadingAirlines } = useAllAirlinesQuery();
  const airlines = Array.isArray(airlinesData) ? airlinesData : [];

  const [selectedAirlineId, setSelectedAirlineId] = useState<number | undefined>(
    currentFlight?.airline ? currentFlight.airline.id : undefined,
  );

  const { data: airlineCitiesData, isLoading: isLoadingAirlineCities } = useAirlineCitiesQuery(
    { airlineId: selectedAirlineId?.toString() || "", page: 1 },
    { enabled: !!selectedAirlineId },
  );

  const airlineCities = Array.isArray(airlineCitiesData?.data) ? airlineCitiesData.data : [];

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<CreateFlight>({
    mode: "onTouched",
    resolver: zodResolver(getFlightSchema()),
    defaultValues: {
      airline: selectedAirlineId,
      departure_city: currentFlight?.departureCity
        ? Number(currentFlight.departureCity)
        : undefined,
      arrival_city: currentFlight?.arrivalCity ? Number(currentFlight.arrivalCity) : undefined,
      departure_time: currentFlight?.departureTime ?? "",
      arrival_time: currentFlight?.arrivalTime ?? "",
    },
  });

  useEffect(() => {
    if (isOpen && currentFlight && !hasResetRef.current) {
      const airlineId = currentFlight.airline?.id;
      reset({
        airline: airlineId,
        departure_city: currentFlight.departureCity
          ? Number(currentFlight.departureCity)
          : undefined,
        arrival_city: currentFlight.arrivalCity ? Number(currentFlight.arrivalCity) : undefined,
        departure_time: currentFlight.departureTime ?? "",
        arrival_time: currentFlight.arrivalTime ?? "",
      });
      setSelectedAirlineId(airlineId);
      hasResetRef.current = true;
    }

    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentFlight, reset]);

  const onSubmit: SubmitHandler<CreateFlight> = (data) => {
    const payload = {
      airline_id: data.airline,
      departure_city_id: data.departure_city,
      arrival_city_id: data.arrival_city,
      departure_time: data.departure_time,
      arrival_time: data.arrival_time,
    };

    if (isNewFlight) {
      return createFlight(payload, {
        onSuccess: () => {
          toast.success(t("flights.create.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<CreateFlight>(error, setError, t("flights.create.error"));
        },
      });
    }

    return updateFlight(
      { id: currentFlight!.id, ...payload },
      {
        onSuccess: () => {
          toast.success(t("flights.update.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<UpdateFlight>(error, setError, t("flights.update.error"));
        },
      },
    );
  };

  const handleAirlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedAirlineId(id);
    setValue("airline", id);
    setValue("departure_city");
    setValue("arrival_city");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const watchedValues = watch();

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Content isDismissible={!isPending}>
        <Dialog.Header>
          <Dialog.Title>
            {isNewFlight ? t("flights.create.title") : t("flights.update.title")}
          </Dialog.Title>
        </Dialog.Header>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="airline">{t("flights.form.airline")}</Label>
            <select
              {...register("airline", { valueAsNumber: true })}
              className="rounded border px-3 py-2 text-sm disabled:opacity-50"
              disabled={isLoadingAirlines}
              id="airline"
              onChange={handleAirlineChange}
              value={selectedAirlineId || ""}
            >
              <option value="">{t("airlines.select")}</option>
              {airlines.map((airline) => {
                return (
                  <option key={airline.id} value={airline.id}>
                    {airline.name}
                  </option>
                );
              })}
            </select>
            <ErrorMessage errorMessage={errors?.airline?.message} />
          </div>

          {["departure_city", "arrival_city"].map((field) => {
            return (
              <div className="flex flex-col gap-2" key={field}>
                <Label htmlFor={field}>{t(`flights.form.${field}`)}</Label>
                <select
                  className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                  disabled={isLoadingAirlineCities || !selectedAirlineId}
                  id={field}
                  {...register(field as keyof CreateFlight, { valueAsNumber: true })}
                >
                  <option value="">{t("cities.select")}</option>
                  {airlineCities.map((city) => {
                    const isSelected =
                      field === "arrival_city" && watchedValues.departure_city === city.id;

                    return (
                      <option
                        disabled={isSelected}
                        key={city.id}
                        style={isSelected ? { color: "#999" } : undefined}
                        value={city.id}
                      >
                        {city.name} {isSelected ? "(Already selected as departure)" : ""}
                      </option>
                    );
                  })}
                </select>
                <ErrorMessage errorMessage={errors?.airline?.message} />
              </div>
            );
          })}
          {(["departure_time", "arrival_time"] as const).map((field) => {
            return (
              <div className="flex flex-col gap-2" key={field}>
                <Label htmlFor={field}>{t(`flights.form.${field}`)}</Label>
                <Input id={field} size="sm" type="date" {...register(field)} />
                <ErrorMessage errorMessage={errors?.[field]?.message} />
              </div>
            );
          })}

          <Dialog.Footer>
            <Dialog.Close disabled={isPending} asChild>
              <Button variant="outlined">{t("buttons.cancel")}</Button>
            </Dialog.Close>
            <Button isLoading={isPending} type="submit">
              {isNewFlight ? t("buttons.create") : t("buttons.update")}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
