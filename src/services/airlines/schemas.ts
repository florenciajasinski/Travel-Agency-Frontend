import { z } from "zod";

import i18n from "@/i18n";

export const airlineSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  flightsCount: z.number().int().nonnegative(),
});

export const getAirlineSchema = () => {
  return airlineSchema.omit({ id: true }).extend({
    name: z.string().min(1, { message: i18n.t("airlines.validation.name.required") }),
    description: z.string().min(1, { message: i18n.t("airlines.validation.description.required") }),
    flightsCount: z
      .number()
      .int()
      .min(0, { message: i18n.t("validation.nonNegative") })
      .optional(),
  });
};
