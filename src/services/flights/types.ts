import type { z } from "zod";

import type { RequestParams } from "@/services/types";
import type { FLIGHT_FILTER_KEYS } from "./constants";
import type { flightSchema, getFlightSchema } from "./schemas";

export type Flight = z.infer<typeof flightSchema>;

export type FlightFilterKey = (typeof FLIGHT_FILTER_KEYS)[keyof typeof FLIGHT_FILTER_KEYS];

export type FlightRequestParams = RequestParams<Record<FlightFilterKey, string | undefined>>;

export type CreateFlight = z.infer<ReturnType<typeof getFlightSchema>>;

export type UpdateFlight = z.infer<ReturnType<typeof getFlightSchema>> & Pick<Flight, "id">;
