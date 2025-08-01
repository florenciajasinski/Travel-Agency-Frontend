import type { z } from "zod";

import type { RequestParams } from "@/services/types";
import type { USER_FILTER_KEYS } from "./constants";
import type { getUserSchema, userSchema } from "./schemas";

export type User = z.infer<typeof userSchema>;

export type UserFilterKey = (typeof USER_FILTER_KEYS)[keyof typeof USER_FILTER_KEYS];

export type UserRequestParams = RequestParams<Record<UserFilterKey, string | undefined>>;

export type CreateUser = z.infer<ReturnType<typeof getUserSchema>>;

export type UpdateUser = z.infer<ReturnType<typeof getUserSchema>> & Pick<User, "id">;
