import { createQueryKeys } from "@lukemorales/query-key-factory";

import { createCity, deleteCity, getCitiesList, updateCity } from "./api";

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
});

export const mutations = {
  create: createCity,
  delete: deleteCity,
  update: updateCity,
};
