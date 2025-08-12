import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  createCity,
  deleteCity,
  getAirlineCities,
  getAllCities,
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
  all: () => {
    return {
      queryKey: ["all"],
      queryFn: () => {
        return getAllCities();
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
