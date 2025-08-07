import { z } from "zod";

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
  return z
    .object({
      airline: z.number().min(1, "Airline is required"),
      departure_city: z.number().min(1, "Departure city is required"),
      arrival_city: z.number().min(1, "Arrival city is required"),
      departure_time: z.string().min(1, "Departure time is required"),
      arrival_time: z.string().min(1, "Arrival time is required"),
    })
    .refine(
      (data) => {
        return data.departure_city !== data.arrival_city;
      },
      {
        message: "The arrival city cannot be the same as the departure city",
        path: ["arrival_city"],
      },
    );
};
