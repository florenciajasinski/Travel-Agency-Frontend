import type { LoginRequest } from "./types";

export const login = ({ email, password }: LoginRequest) => {
  return Promise.resolve({
    data: { authToken: `super-encrypted-auth-token-for-${email}-${password}` },
  });
  // return publicApi.post<ServiceResponse<LoginResponse>>('auth/login', { email, password });
};
