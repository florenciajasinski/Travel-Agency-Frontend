import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { airlineSchema } from "../airlines/schemas";
import { citySchema } from "./schemas";
import type { City, CityRequestParams, CreateCity, UpdateCity } from "./types";

export const getCitiesList = async ({ page }: CityRequestParams) => {
  const response = await publicApi.get("cities", {
    params: { page },
  });

  return parsePaginatedResponse(z.array(citySchema), response.data);
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
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const cities = z.array(citySchema).parse(response.data.data);

    return {
      data: cities,
      meta: response.data.meta || {
        currentPage: page || 1,
        perPage: cities.length,
        total: cities.length,
        lastPage: 1,
        from: 1,
        to: cities.length,
      },
    };
  }
  if (Array.isArray(response.data)) {
    const cities = z.array(citySchema).parse(response.data);

    return {
      data: cities,
      meta: {
        currentPage: page || 1,
        perPage: cities.length,
        total: cities.length,
        lastPage: 1,
        from: 1,
        to: cities.length,
      },
    };
  }
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

export const getCityAirlines = async ({ cityId, page }: { cityId: string; page?: number }) => {
  const response = await publicApi.get(`cities/${cityId}/airlines`, {
    params: { page },
  });

  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    const airlines = z.array(airlineSchema).parse(response.data.data);

    return {
      data: airlines,
      meta: response.data.meta || {
        currentPage: page || 1,
        perPage: airlines.length,
        total: airlines.length,
        lastPage: 1,
        from: 1,
        to: airlines.length,
      },
    };
  }
  if (Array.isArray(response.data)) {
    const airlines = z.array(airlineSchema).parse(response.data);

    return {
      data: airlines,
      meta: {
        currentPage: page || 1,
        perPage: airlines.length,
        total: airlines.length,
        lastPage: 1,
        from: 1,
        to: airlines.length,
      },
    };
  }
};
