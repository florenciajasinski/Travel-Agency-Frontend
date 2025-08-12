import type { z } from "zod";

import type { RequestParams } from "@/services/types";
import type { AIRLINE_FILTER_KEYS } from "./constants";
import type { airlineSchema, getAirlineSchema } from "./schemas";

export type Airline = z.infer<typeof airlineSchema>;

export type AirlineFilterKey = (typeof AIRLINE_FILTER_KEYS)[keyof typeof AIRLINE_FILTER_KEYS];

export type AirlineRequestParams = RequestParams<Record<AirlineFilterKey, string | undefined>>;

export type CreateAirlinePayload = z.infer<ReturnType<typeof getAirlineSchema>>;

export type UpdateAirlinePayload = z.infer<ReturnType<typeof getAirlineSchema>> &
  Pick<Airline, "id">;

export type UpsertAirlineFormData = {
  name: string;
  description: string;
  flightsCount?: number;
};
