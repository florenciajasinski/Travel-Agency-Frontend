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
  return flightSchema.omit({ id: true });
};
