import { createQueryKeys } from "@lukemorales/query-key-factory";

import { createFlight, deleteFlight, getAllFlights, getFlightsList, updateFlight } from "./api";

export const queries = createQueryKeys("flights", {
  list: (params) => {
    return {
      queryKey: [params],
      queryFn: () => {
        return getFlightsList(params);
      },
    };
  },
  all: () => {
    return {
      queryKey: ["all"],
      queryFn: () => {
        return getAllFlights();
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
  create: createFlight,
  delete: deleteFlight,
  update: updateFlight,
};
