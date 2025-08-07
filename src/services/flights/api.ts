import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { flightSchema } from "./schemas";
import type { CreateFlight, Flight, FlightRequestParams, UpdateFlight } from "./types";

export const getFlightsList = async ({ page }: FlightRequestParams) => {
  console.log("[getFlightsList] Fetching page:", page);

  const response = await publicApi.get("flights", {
    params: { page },
  });

  console.log("[getFlightsList] Raw response data:", response.data);

  const parsed = parsePaginatedResponse(z.array(flightSchema), response.data);

  console.log("[getFlightsList] Parsed result:", parsed);

  return parsed;
};

export const deleteFlight = async (id: Flight["id"]) => {
  console.log("[deleteFlight] Deleting flight with ID:", id);

  const response = await publicApi.delete(`flights/${id}`);

  console.log("[deleteFlight] Response:", response.data);

  return response;
};

export const createFlight = async (data: CreateFlight) => {
  const payload = deepSnakeKeys(data);

  console.log("[createFlight] Payload:", payload);

  const response = await publicApi.post("flights", payload);

  console.log("[createFlight] Response:", response.data);

  return response;
};

export const updateFlight = async (data: UpdateFlight) => {
  const payload = deepSnakeKeys(data);

  console.log("[updateFlight] Updating flight:", data.id, "with payload:", payload);

  const response = await publicApi.put(`flights/${data.id}`, payload);

  console.log("[updateFlight] Response:", response.data);

  return response;
};

export const getAllFlights = async (): Promise<Flight[]> => {
  console.log("[getAllFlights] Fetching all flights...");

  const response = await publicApi.get("flights");

  console.log("[getAllFlights] Raw response data:", response.data);

  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const paginatedResult = parsePaginatedResponse(z.array(flightSchema), response.data);

    console.log("[getAllFlights] Parsed result (paginated):", paginatedResult);

    return paginatedResult.data;
  }

  if (Array.isArray(response.data)) {
    const flightsArray = z.array(flightSchema).parse(response.data);

    console.log("[getAllFlights] Parsed result (plain array):", flightsArray);

    return flightsArray;
  }

  console.warn("[getAllFlights] No flights found or invalid format.");

  return [];
};
