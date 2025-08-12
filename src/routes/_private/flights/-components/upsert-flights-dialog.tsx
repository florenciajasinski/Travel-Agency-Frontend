import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useAllAirlinesQuery } from "@/services/airlines/actions";
import { useAirlineCitiesQuery } from "@/services/cities/actions";
import { useCreateFlightMutation, useUpdateFlightMutation } from "@/services/flights/actions";
import { getFlightSchema } from "@/services/flights/schemas";
import type { CreateFlightPayload, Flight, UpdateFlightPayload } from "@/services/flights/types";
import { toDateInput } from "@/services/schemas";
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

  const getCityId = (flight?: Flight, cityType?: "departure" | "arrival"): number | undefined => {
    if (!flight || !cityType) {
      return undefined;
    }

    return cityType === "departure" ? flight.departureCity?.id : flight.arrivalCity?.id;
  };

  const initialDepartureId = getCityId(currentFlight, "departure");
  const initialArrivalId = getCityId(currentFlight, "arrival");

  const initialAirlineId = currentFlight?.airline?.id ?? airlines[0]?.id;

  const [selectedAirlineId, setSelectedAirlineId] =
    useState<Flight["airline"]["id"]>(initialAirlineId);

  const { data: airlineCitiesData, isLoading: isLoadingAirlineCities } = useAirlineCitiesQuery(
    { airlineId: selectedAirlineId?.toString() || "", page: 1 },
    { enabled: !!selectedAirlineId },
  );

  const airlineCities = useMemo(() => {
    return Array.isArray(airlineCitiesData?.data) ? airlineCitiesData.data : [];
  }, [airlineCitiesData]);

  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<CreateFlightPayload>({
    mode: "onTouched",
    resolver: zodResolver(getFlightSchema()),
    defaultValues: {
      airline_id: initialAirlineId,
      departure_city_id: initialDepartureId,
      arrival_city_id: initialArrivalId,
      departure_time: toDateInput(currentFlight?.departureTime),
      arrival_time: toDateInput(currentFlight?.arrivalTime),
    },
  });

  useEffect(() => {
    if (isOpen && currentFlight && !hasResetRef.current) {
      reset({
        airline_id: initialAirlineId,
        departure_city_id: initialDepartureId,
        arrival_city_id: initialArrivalId,
        departure_time: toDateInput(currentFlight?.departureTime),
        arrival_time: toDateInput(currentFlight?.arrivalTime),
      });
      setSelectedAirlineId(initialAirlineId);
      hasResetRef.current = true;
    }
    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentFlight, reset, initialAirlineId, initialArrivalId, initialDepartureId]);

  const handleCreate = (payload: CreateFlightPayload) => {
    createFlight(payload, {
      onSuccess: () => {
        toast.success(t("flights.create.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<CreateFlightPayload>(error, setError, t("flights.create.error"));
      },
    });
  };

  const handleUpdate = (payload: UpdateFlightPayload) => {
    updateFlight(payload, {
      onSuccess: () => {
        toast.success(t("flights.update.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<UpdateFlightPayload>(error, setError, t("flights.update.error"));
      },
    });
  };

  const onSubmit: SubmitHandler<CreateFlightPayload> = (data) => {
    const payload = { ...data };

    if (isNewFlight) {
      return handleCreate(payload);
    }

    return handleUpdate({ id: currentFlight!.id, ...payload });
  };

  const handleFlightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    reset({
      airline_id: id,
      departure_city_id: 0,
      arrival_city_id: 0,
      departure_time: "",
      arrival_time: "",
    });
    setSelectedAirlineId(id);
    clearErrors();
  };

  const watched = {
    airline_id: watch("airline_id"),
    departure_city_id: watch("departure_city_id"),
    arrival_city_id: watch("arrival_city_id"),
  };

  const cityFields = ["departure_city_id", "arrival_city_id"] as const;
  const dateFields = ["departure_time", "arrival_time"] as const;

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
            {isNewFlight ? t("flights.create.title") : t("flights.update.title")}
          </Dialog.Title>
        </Dialog.Header>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="airline">{t("flights.form.airline")}</Label>
            <select
              className="rounded border px-3 py-2 text-sm disabled:opacity-50"
              disabled={isLoadingAirlines}
              id="airline"
              {...register("airline_id", {
                setValueAs: (v) => {
                  return v === "" ? 0 : Number(v);
                },
              })}
              onChange={handleFlightChange}
              value={selectedAirlineId ? String(selectedAirlineId) : ""}
            >
              <option value="">{t("airlines.select")}</option>
              {airlines.map((airline) => {
                return (
                  <option key={airline.id} value={String(airline.id)}>
                    {airline.name}
                  </option>
                );
              })}
            </select>
            <ErrorMessage errorMessage={errors.airline_id?.message} />
          </div>
          {cityFields.map((field) => {
            return (
              <div className="flex flex-col gap-2" key={field}>
                <Label htmlFor={field}>{t(`flights.form.${field}`)}</Label>
                <select
                  className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                  disabled={isLoadingAirlineCities || !selectedAirlineId}
                  id={field}
                  {...register(field, {
                    setValueAs: (v) => {
                      return v === "" ? 0 : Number(v);
                    },
                  })}
                  value={watch(field) ? String(watch(field)) : ""}
                >
                  <option value="">{t("cities.select")}</option>
                  {airlineCities.map((city) => {
                    const isSelectedAsDeparture =
                      field === "arrival_city_id" &&
                      String(watched.departure_city_id) === String(city.id);

                    return (
                      <option
                        disabled={isSelectedAsDeparture}
                        key={city.id}
                        style={isSelectedAsDeparture ? { color: "#999" } : undefined}
                        value={String(city.id)}
                      >
                        {city.name} {isSelectedAsDeparture ? "(Already selected as departure)" : ""}
                      </option>
                    );
                  })}
                </select>
                <ErrorMessage errorMessage={errors[field]?.message} />
              </div>
            );
          })}
          {dateFields.map((field) => {
            return (
              <div className="flex flex-col gap-2" key={field}>
                <Label htmlFor={field}>{t(`flights.form.${field}`)}</Label>
                <Input id={field} size="sm" type="date" {...register(field)} />
                <ErrorMessage errorMessage={errors[field]?.message} />
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
