import { z } from "zod";

import i18n from "@/i18n";

export const airlineSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  numberOfFlights: z.number().int().nonnegative().optional(),
});

export const getAirlineSchema = () => {
  return airlineSchema
    .omit({ id: true })
    .extend({
      name: z.string().min(1, { message: i18n.t("airlines.validation.required") }),
    })
    .extend({
      description: z.string().optional(),
      numberOfFlights: z
        .number()
        .int()
        .min(0, { message: i18n.t("validation.nonNegative") })
        .optional(),
    });
};
