import {
  loginWithCredentials,
  isAuthenticated as checkAuth,
  logout as signOut,
} from "../services/authService";

export const login = async (
  username: string,
  password: string,
): Promise<boolean> => {
  return await loginWithCredentials({ username, password });
};

export const isAuthenticated = (): boolean => {
  return checkAuth();
};

export const logout = (): void => {
  signOut();
};
