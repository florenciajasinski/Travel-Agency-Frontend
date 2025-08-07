import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { flightSchema } from "./schemas";
import type { CreateFlight, Flight, FlightRequestParams, UpdateFlight } from "./types";

export const getFlightsList = async ({ page }: FlightRequestParams) => {
  const response = await publicApi.get("flights", {
    params: { page },
  });

  const parsed = parsePaginatedResponse(z.array(flightSchema), response.data);

  return parsed;
};

export const deleteFlight = async (id: Flight["id"]) => {
  const response = await publicApi.delete(`flights/${id}`);

  return response;
};

export const createFlight = async (data: CreateFlight) => {
  const payload = deepSnakeKeys(data);

  const response = await publicApi.post("flights", payload);

  return response;
};

export const updateFlight = async (data: UpdateFlight) => {
  const payload = deepSnakeKeys(data);

  const response = await publicApi.put(`flights/${data.id}`, payload);

  return response;
};

export const getAllFlights = async (): Promise<Flight[]> => {
  const response = await publicApi.get("flights");
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const paginatedResult = parsePaginatedResponse(z.array(flightSchema), response.data);

    return paginatedResult.data;
  }

  if (Array.isArray(response.data)) {
    const flightsArray = z.array(flightSchema).parse(response.data);

    return flightsArray;
  }

  return [];
};
