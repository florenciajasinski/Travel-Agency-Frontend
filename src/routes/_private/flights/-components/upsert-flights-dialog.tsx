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
import type { CreateFlight, Flight, UpdateFlight } from "@/services/flights/types";
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

  const initialAirlineId = currentFlight?.airline?.id ?? undefined;

  const getCityId = (flight?: Flight, cityType?: "departure" | "arrival"): number | undefined => {
    if (!flight || !cityType) {
      return undefined;
    }

    return cityType === "departure" ? flight.departureCity?.id : flight.arrivalCity?.id;
  };

  const initialDepartureId = getCityId(currentFlight, "departure");
  const initialArrivalId = getCityId(currentFlight, "arrival");

  const [selectedAirlineId, setSelectedAirlineId] = useState<number | undefined>(initialAirlineId);

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
  } = useForm<CreateFlight>({
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

  useEffect(() => {
    if (!isOpen || !currentFlight) {
      return;
    }
    if (!isLoadingAirlineCities && airlineCities.length > 0) {
      if (initialDepartureId) {
        setValue("departure_city_id", initialDepartureId);
      }
      if (initialArrivalId) {
        setValue("arrival_city_id", initialArrivalId);
      }
    }
  }, [
    isOpen,
    currentFlight,
    isLoadingAirlineCities,
    airlineCities,
    initialDepartureId,
    initialArrivalId,
    setValue,
  ]);

  const handleCreate = (payload: CreateFlight) => {
    createFlight(payload, {
      onSuccess: () => {
        toast.success(t("flights.create.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<CreateFlight>(error, setError, t("flights.create.error"));
      },
    });
  };

  const handleUpdate = (payload: UpdateFlight) => {
    updateFlight(payload, {
      onSuccess: () => {
        toast.success(t("flights.update.success"));
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        handleAxiosFieldErrors<UpdateFlight>(error, setError, t("flights.update.error"));
      },
    });
  };

  const onSubmit: SubmitHandler<CreateFlight> = (data) => {
    const payload = {
      airline_id: data.airline_id,
      departure_city_id: data.departure_city_id,
      arrival_city_id: data.arrival_city_id,
      departure_time: data.departure_time,
      arrival_time: data.arrival_time,
    };

    if (isNewFlight) {
      return handleCreate(payload);
    }

    return handleUpdate({ id: currentFlight!.id, ...payload });
  };

  const handleAirlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedAirlineId(id || undefined);
    setValue("airline_id", id || (undefined as unknown as number));
    setValue("departure_city_id", undefined as unknown as number);
    setValue("arrival_city_id", undefined as unknown as number);
    clearErrors(["departure_city_id", "arrival_city_id"]);
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
              {...register("airline_id", { valueAsNumber: true })}
              onChange={handleAirlineChange}
              value={selectedAirlineId ?? ""}
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
                  value={watch(field) ?? ""}
                  {...register(field, { valueAsNumber: true })}
                >
                  <option value="">{t("cities.select")}</option>
                  {airlineCities.map((city) => {
                    const isSelectedAsDeparture =
                      field === "arrival_city_id" && watched.departure_city_id === city.id;

                    return (
                      <option
                        disabled={isSelectedAsDeparture}
                        key={city.id}
                        style={isSelectedAsDeparture ? { color: "#999" } : undefined}
                        value={city.id}
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
