import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { airlineSchema } from "./schemas";
import type { Airline, AirlineRequestParams, CreateAirline, UpdateAirline } from "./types";

export const getAirlinesList = async ({ filter, page }: AirlineRequestParams) => {
  const response = await publicApi.get("airlines", {
    params: { page, filter },
  });

  return parsePaginatedResponse(z.array(airlineSchema), response.data);
};
export const getAllAirlines = async (): Promise<Airline[]> => {
  const response = await publicApi.get("airlines");

  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const paginatedResult = parsePaginatedResponse(z.array(airlineSchema), response.data);

    return paginatedResult.data;
  }

  if (Array.isArray(response.data)) {
    const airlinesArray = z.array(airlineSchema).parse(response.data);

    return airlinesArray;
  }

  return [];
};
export const deleteAirline = async (id: Airline["id"]) => {
  return publicApi.delete(`airlines/${id}`);
};

export const createAirline = async (data: CreateAirline) => {
  return publicApi.post("airlines", deepSnakeKeys(data));
};

export const updateAirline = async (data: UpdateAirline) => {
  return publicApi.put(`airlines/${data.id}`, deepSnakeKeys(data));
};
