import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  createAirline,
  deleteAirline,
  getAirlinesList,
  getAllAirlines,
  updateAirline,
} from "./api";

export const queries = createQueryKeys("airlines", {
  list: (params) => {
    return {
      queryKey: [params],
      queryFn: () => {
        return getAirlinesList(params);
      },
    };
  },
  all: () => {
    return {
      queryKey: ["all"],
      queryFn: () => {
        return getAllAirlines();
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
  create: createAirline,
  delete: deleteAirline,
  update: updateAirline,
};
