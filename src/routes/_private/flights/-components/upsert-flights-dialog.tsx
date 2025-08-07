import { useEffect, useRef } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Dialog, ErrorMessage, Input, Label, toast } from "@/components/ui";
import { useTranslation } from "@/i18n";
import { useCreateFlightMutation, useUpdateFlightMutation } from "@/services/flights/actions";
import { getFlightSchema } from "@/services/flights/schemas";
import type { Flight, UpdateFlight } from "@/services/flights/types";
import type { UpsertFlightFormData } from "@/services/flights/types";
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

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<UpsertFlightFormData>({
    mode: "onTouched",
    resolver: zodResolver(getFlightSchema()),
    defaultValues: {
      airline_id:
        currentFlight?.airline &&
        Array.isArray(currentFlight.airline) &&
        currentFlight.airline.length > 0
          ? currentFlight.airline[0].id
          : undefined,
      departure_city_id: currentFlight?.departureCity
        ? Number(currentFlight.departureCity)
        : undefined,
      arrival_city_id: currentFlight?.arrivalCity ? Number(currentFlight.arrivalCity) : undefined,
      departure_time: currentFlight?.departureTime ?? "",
      arrival_time: currentFlight?.arrivalTime ?? "",
    },
  });

  useEffect(() => {
    if (isOpen && currentFlight && !hasResetRef.current) {
      reset({
        airline_id:
          currentFlight.airline &&
          Array.isArray(currentFlight.airline) &&
          currentFlight.airline.length > 0
            ? currentFlight.airline[0].id
            : undefined,
        departure_city_id: currentFlight.departureCity
          ? Number(currentFlight.departureCity)
          : undefined,
        arrival_city_id: currentFlight.arrivalCity ? Number(currentFlight.arrivalCity) : undefined,
        departure_time: currentFlight.departureTime ?? "",
        arrival_time: currentFlight.arrivalTime ?? "",
      });
      hasResetRef.current = true;
    }

    if (!isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, currentFlight, reset]);

  const onSubmit: SubmitHandler<UpsertFlightFormData> = (data) => {
    const payload = {
      airline: data.airline_id ? [{ id: data.airline_id }] : undefined,
      departureCity: data.departure_city_id ? String(data.departure_city_id) : undefined,
      arrivalCity: data.arrival_city_id ? String(data.arrival_city_id) : undefined,
      departureTime: data.departure_time,
      arrivalTime: data.arrival_time,
    };

    if (isNewFlight) {
      return createFlight(payload, {
        onSuccess: () => {
          toast.success(t("flights.create.success"));
          onOpenChange(false);
          reset();
        },
        onError: (error) => {
          handleAxiosFieldErrors<UpsertFlightFormData>(error, setError, t("flights.create.error"));
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
            <Label htmlFor="airline_id">{t("flights.form.airline")}</Label>
            <Input {...register("airline_id")} id="airline_id" size="sm" type="number" />
            <ErrorMessage errorMessage={errors?.airline_id?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="departure_city_id">{t("flights.form.departure_city")}</Label>
            <Input
              {...register("departure_city_id")}
              id="departure_city_id"
              size="sm"
              type="number"
            />
            <ErrorMessage errorMessage={errors?.departure_city_id?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="arrival_city_id">{t("flights.form.arrival_city")}</Label>
            <Input {...register("arrival_city_id")} id="arrival_city_id" size="sm" type="number" />
            <ErrorMessage errorMessage={errors?.arrival_city_id?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="departure_time">{t("flights.form.departure_time")}</Label>
            <Input {...register("departure_time")} id="departure_time" size="sm" type="text" />
            <ErrorMessage errorMessage={errors?.departure_time?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="arrival_time">{t("flights.form.arrival_time")}</Label>
            <Input {...register("arrival_time")} id="arrival_time" size="sm" type="text" />
            <ErrorMessage errorMessage={errors?.arrival_time?.message} />
          </div>

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
