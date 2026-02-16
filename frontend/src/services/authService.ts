import api from "./api";
import type { LoginResponse } from "../types";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return response.data;
  },
};
