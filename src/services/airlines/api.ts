import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { airlineSchema } from "./schemas";
import type { Airline, AirlineRequestParams, CreateAirline, UpdateAirline } from "./types";

export const getAirlinesList = async ({ page }: AirlineRequestParams) => {
  const response = await publicApi.get("airlines", {
    params: { page },
  });

  return parsePaginatedResponse(z.array(airlineSchema), response.data);
};

export const deleteAirline = async (id: Airline["id"]) => {
  const response = await publicApi.delete(`airlines/${id}`);

  return response;
};

export const createAirline = async (data: CreateAirline) => {
  const payload = deepSnakeKeys(data);
  const response = await publicApi.post("airlines", payload);

  return response;
};

export const updateAirline = async (data: UpdateAirline) => {
  const payload = deepSnakeKeys(data);
  const response = await publicApi.put(`airlines/${data.id}`, payload);

  return response;
};

export const getAllAirlines = async (): Promise<Airline[]> => {
  const { data: airlinesData } = await publicApi.get("airlines");
  if (airlinesData && Array.isArray(airlinesData.data)) {
    const { data } = parsePaginatedResponse(z.array(airlineSchema), airlinesData);

    return data;
  }

  if (Array.isArray(airlinesData)) {
    return z.array(airlineSchema).parse(airlinesData);
  }

  return [];
};
