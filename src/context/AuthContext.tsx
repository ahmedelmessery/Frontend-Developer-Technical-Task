"use client";

/**
 * AuthContext — provides user auth state (JWT token) across the app.
 * Uses RouteМisr ecommerce API for signin/signup.
 * Token is stored in a cookie via js-cookie (7-day expiry).
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const BASE = "https://ecommerce.routemisr.com/api/v1";

interface AuthUser {
  name: string;
  email: string;
  role?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    rePassword: string,
    phone: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get(TOKEN_KEY);
    const savedUser = Cookies.get(USER_KEY);
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        /* ignore malformed cookie */
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${BASE}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid email or password");
    }

    const loggedInUser: AuthUser = {
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };

    Cookies.set(TOKEN_KEY, data.token, { expires: 7, sameSite: "strict" });
    Cookies.set(USER_KEY, JSON.stringify(loggedInUser), {
      expires: 7,
      sameSite: "strict",
    });

    setToken(data.token);
    setUser(loggedInUser);
  }, []);


  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      rePassword: string,
      phone: string
    ) => {
      const res = await fetch(`${BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, rePassword, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      const registeredUser: AuthUser = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      Cookies.set(TOKEN_KEY, data.token, { expires: 7, sameSite: "strict" });
      Cookies.set(USER_KEY, JSON.stringify(registeredUser), {
        expires: 7,
        sameSite: "strict",
      });

      setToken(data.token);
      setUser(registeredUser);
    },
    []
  );

  const logout = useCallback(() => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
