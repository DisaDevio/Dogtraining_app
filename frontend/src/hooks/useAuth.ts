import { useState, useEffect } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isLoading: true,
    error: null,
  });

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/api/check_login");
      const data = await response.json();
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: data.logged_in,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error checking login status:", error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to check login status",
      }));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: true,
          isLoading: false,
        }));
        return true;
      } else {
        const data = await response.json();
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || "Login failed",
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "An error occurred during login.",
      }));
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      isLoading: false,
      error: null,
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkLoginStatus,
  };
};