import { deepSnakeKeys } from "string-ts";
import { z } from "zod";

import { publicApi } from "@/config/api";
import { parsePaginatedResponse } from "@/services/schemas";
import { userSchema } from "./schemas";
import type { CreateUser, UpdateUser, User, UserRequestParams } from "./types";

export const getUsersList = async ({ filter, page }: UserRequestParams) => {
  const response = await publicApi.get("users", {
    params: { page, filter },
  });

  return parsePaginatedResponse(z.array(userSchema), response.data);
};

export const deleteUser = async (id: User["id"]) => {
  return publicApi.delete(`users/${id}`);
};

export const createUser = async (data: CreateUser) => {
  return publicApi.post("users", deepSnakeKeys(data));
};

export const updateUser = async (data: UpdateUser) => {
  return publicApi.put(`users/${data.id}`, deepSnakeKeys(data));
};
