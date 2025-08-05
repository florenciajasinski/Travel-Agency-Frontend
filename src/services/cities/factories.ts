import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  createCity,
  deleteCity,
  getAirlineCities,
  getCitiesList,
  getCityAirlines,
  updateCity,
} from "./api";

export const queries = createQueryKeys("cities", {
  list: (params) => {
    return {
      queryKey: [params],
      queryFn: () => {
        return getCitiesList(params);
      },
    };
  },
  detail: (id: string) => {
    return {
      queryKey: [id],
      queryFn: () => {
        throw new Error("not implemented");
      },
    };
  },
  cityAirlines: (params: {
    cityId: string;
    filter?: Record<string, string | undefined>;
    page?: number;
  }) => {
    return {
      queryKey: ["city", params.cityId, params],
      queryFn: () => {
        return getCityAirlines(params);
      },
    };
  },

  airlineCities: (params: {
    airlineId: string;
    filter?: Record<string, string | undefined>;
    page?: number;
  }) => {
    return {
      queryKey: ["airline", params.airlineId, params],
      queryFn: () => {
        return getAirlineCities(params);
      },
    };
  },
});

export const mutations = {
  create: createCity,
  delete: deleteCity,
  update: updateCity,
};
