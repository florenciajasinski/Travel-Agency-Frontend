import { z } from "zod";

import i18n from "@/i18n";
import { airlineSchema } from "../airlines/schemas";
import { citySchema } from "../cities";

export const flightSchema = z.object({
  id: z.number(),
  airline: airlineSchema,
  departureCity: citySchema,
  arrivalCity: citySchema,
  departureTime: z.string().datetime({ offset: true }),
  arrivalTime: z.string().datetime({ offset: true }),
});

export const getFlightSchema = () => {
  return z.object({
    airline_id: z.number().min(1, { message: i18n.t("flights.validation.airline.required") }),
    departure_city_id: z
      .number()
      .min(1, { message: i18n.t("flights.validation.departure.required") }),
    arrival_city_id: z.number().min(1, { message: i18n.t("flights.validation.arrival.required") }),
    departure_time: z
      .string()
      .min(1, { message: i18n.t("flights.validation.departure_time.required") }),
    arrival_time: z
      .string()
      .min(1, { message: i18n.t("flights.validation.arrival_time.required") }),
  });
};
