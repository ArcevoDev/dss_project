import { createContext, useContext, useState, useCallback, createElement, type ReactNode } from "react";
import { toast } from "sonner";
import { api } from "@/api";
import type { AuthResponse, AuthStudent, RegisterPayload } from "@/types";

interface AuthContextValue {
  token: string | null;
  student: AuthStudent | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("dss_token") ?? null);
  const [student, setStudent] = useState<AuthStudent | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("dss_student") ?? "null") as AuthStudent | null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    localStorage.setItem("dss_token", data.token);
    localStorage.setItem("dss_student", JSON.stringify(data.student));
    setToken(data.token);
    setStudent(data.student);
    toast.success(`Welcome back, ${data.student.fullName.split(" ")[0]}!`);
    return data;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    localStorage.setItem("dss_token", data.token);
    localStorage.setItem("dss_student", JSON.stringify(data.student));
    setToken(data.token);
    setStudent(data.student);
    toast.success("Account created! Let's begin your assessment.");
    return data;
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem("dss_token");
    localStorage.removeItem("dss_student");
    setToken(null);
    setStudent(null);
    toast.info("You've been logged out.");
  }, []);

  return createElement(
    AuthContext.Provider,
    { value: { token, student, login, register, logout } },
    children,
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
