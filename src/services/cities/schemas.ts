import { z } from "zod";

import i18n from "@/i18n";
import { airlineSchema } from "../airlines/schemas";

export const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  incomingFlights: z.number().int().nonnegative().optional(),
  outgoingFlights: z.number().int().nonnegative().optional(),
  airline_ids: z.array(z.coerce.number()).optional(),
  airlines: z.array(airlineSchema).optional(),
});

export const getCitySchema = () => {
  return z.object({
    name: z.string().min(1, { message: i18n.t("cities.validation.required") }),
    incomingFlights: z.number().min(0).optional(),
    outgoingFlights: z.number().min(0).optional(),
    airline_ids: z.array(z.coerce.number()).optional(),
  });
};
