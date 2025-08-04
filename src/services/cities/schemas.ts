import { z } from "zod";

import i18n from "@/i18n";

export const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  incomingFlights: z.number().int().nonnegative(),
  outgoingFlights: z.number().int().nonnegative(),
});

export const getCitySchema = () => {
  return citySchema
    .omit({ id: true })
    .extend({
      name: z.string().min(1, { message: i18n.t("validation.required") }),
    })
    .extend({
      incomingFlights: z.number().min(0),
      outgoingFlights: z.number().min(0),
    });
};
