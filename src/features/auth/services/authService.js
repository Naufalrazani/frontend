import { apiClient } from "@shared/services/apiClient";
import {
  setTokens,
  removeTokens,
  getRefreshToken,
  isAuthenticated,
} from "../../../utils/tokenManager";

export const login = async (email, password) => {
  const response = await apiClient.post("/authentications", {
    email,
    password,
  });

  const { accessToken, refreshToken } = response.data.data;
  setTokens(accessToken, refreshToken);

  return { accessToken, refreshToken };
};

export const logout = async () => {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await apiClient.delete("/authentications", { data: { refreshToken } });
    }
  } catch (error) {
    console.warn(
      "Logout failed on server, deleting local token anyway.",
      error
    );
  } finally {
    removeTokens();
  }
};

export const getProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data.data.user;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/users", userData);
  return response.data.data.userId;
};

export { isAuthenticated };
