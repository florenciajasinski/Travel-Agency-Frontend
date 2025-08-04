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

export const deleteCity = async (id: City["id"]) => {
  return publicApi.delete(`cities/${id}`);
};

export const createCity = async (data: CreateCity) => {
  return publicApi.post("cities", deepSnakeKeys(data));
};

export const updateCity = async (data: UpdateCity) => {
  return publicApi.put(`cities/${data.id}`, deepSnakeKeys(data));
};
