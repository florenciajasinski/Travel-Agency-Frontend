import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { formatListResponse, parsePaginatedResponse } from "@/services/schemas";
import { airlineSchema } from "../airlines/schemas";
import { citySchema } from "./schemas";
import type { City, CityRequestParams, CreateCity, UpdateCity } from "./types";

export const getCitiesList = async ({ page }: CityRequestParams) => {
  const response = await publicApi.get("cities", {
    params: { page },
  });

  return parsePaginatedResponse(z.array(citySchema), response.data);
};

export const deleteCity = async (id: City["id"]) => {
  const response = await publicApi.delete(`cities/${id}`);

  return response;
};

export const createCity = async (data: CreateCity) => {
  const payload = deepSnakeKeys(data);
  const response = await publicApi.post("cities", payload);

  return response;
};

export const updateCity = async (data: UpdateCity) => {
  const payload = deepSnakeKeys(data);
  const response = await publicApi.put(`cities/${data.id}`, payload);

  return response;
};

export const getAirlineCities = async ({
  airlineId,
  page,
}: {
  airlineId: string;
  page?: number;
}) => {
  const response = await publicApi.get(`airlines/${airlineId}/cities`, {
    params: { page },
  });

  return formatListResponse(citySchema, response.data, page || 1);
};

export const getCityAirlines = async ({ cityId, page }: { cityId: string; page?: number }) => {
  const response = await publicApi.get(`cities/${cityId}/airlines`, {
    params: { page },
  });

  return formatListResponse(airlineSchema, response.data, page || 1);
};
export const getAllCities = async (): Promise<City[]> => {
  const response = await publicApi.get("cities");

  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const paginatedResult = parsePaginatedResponse(z.array(citySchema), response.data);

    return paginatedResult.data;
  }

  if (Array.isArray(response.data)) {
    const citiesArray = z.array(citySchema).parse(response.data);

    return citiesArray;
  }

  return [];
};
