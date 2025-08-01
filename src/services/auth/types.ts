import type { z } from "zod";

import type { getLoginRequestSchema, loginResponseSchema } from "./schemas";

export type LoginRequest = z.infer<ReturnType<typeof getLoginRequestSchema>>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
