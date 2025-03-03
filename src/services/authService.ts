import { supabase } from "../lib/supabase";

export interface LoginCredentials {
  username: string;
  password: string;
}

export const loginWithCredentials = async (
  credentials: LoginCredentials,
): Promise<boolean> => {
  try {
    // Call the check_login function we created in Supabase
    const { data, error } = await supabase.rpc("check_login", {
      p_username: credentials.username,
      p_password: credentials.password,
    });

    if (error) {
      console.error("Login error:", error);
      return false;
    }

    if (data) {
      // Store authentication state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Login exception:", error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const logout = (): void => {
  localStorage.removeItem("isAuthenticated");
};
