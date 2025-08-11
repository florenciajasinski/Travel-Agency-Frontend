import type { z } from "zod";

import type { RequestParams } from "@/services/types";
import type { CITY_FILTER_KEYS } from "./constants";
import type { citySchema, getCitySchema } from "./schemas";

export type City = z.infer<typeof citySchema>;

export type CityFilterKey = (typeof CITY_FILTER_KEYS)[keyof typeof CITY_FILTER_KEYS];

export type CityRequestParams = RequestParams<Record<CityFilterKey, string | undefined>>;

export type CreateCity = z.infer<ReturnType<typeof getCitySchema>>;

export type UpdateCity = z.infer<ReturnType<typeof getCitySchema>> & Pick<City, "id">;

export type UpsertCityFormData = z.input<ReturnType<typeof getCitySchema>>;
