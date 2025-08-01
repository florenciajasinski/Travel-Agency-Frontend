import { createQueryKeys } from "@lukemorales/query-key-factory";

import { createUser, deleteUser, getUsersList, updateUser } from "./api";

export const queries = createQueryKeys("users", {
  list: (params) => {
    return {
      queryKey: [params],
      queryFn: () => {
        return getUsersList(params);
      },
    };
  },
});

export const mutations = {
  create: createUser,
  delete: deleteUser,
  update: updateUser,
};
