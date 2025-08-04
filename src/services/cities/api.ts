import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { citySchema } from "./schemas";
import type { City, CityRequestParams, CreateCity, UpdateCity } from "./types";

export const getCitiesList = async ({ filter, page }: CityRequestParams) => {
  const response = await publicApi.get("cities", {
    params: { page, filter },
  });

  return parsePaginatedResponse(z.array(citySchema), response.data);
};
export const getAirlineCities = async ({
  airlineId,
  filter,
  page,
}: {
  airlineId: string;
  filter?: Record<string, string | undefined>;
  page?: number;
}) => {
  try {
    const response = await publicApi.get(`airlines/${airlineId}/cities`, {
      params: { page, filter },
    });
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const cities = z.array(citySchema).parse(response.data.data);

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

    return {
      data: [],
      meta: {
        currentPage: page || 1,
        perPage: 0,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
      },
    };
  } catch (error) {
    console.error("getAirlineCities ERROR:", error);
    throw error;
  }
};

export const deleteCity = async (id: City["id"]) => {
  return publicApi.delete(`cities/${id}`);
};

export const createCity = async (data: CreateCity) => {
  return publicApi.post("cities", deepSnakeKeys(data));
};

export const updateCity = async (data: UpdateCity) => {
  return publicApi.put(`cities/${data.id}`, deepSnakeKeys(data));
};
