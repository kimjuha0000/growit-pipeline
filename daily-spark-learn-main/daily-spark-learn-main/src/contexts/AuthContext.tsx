import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  isSessionLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = AuthContextType & {
  children: ReactNode;
};

export function AuthProvider({ session, isSessionLoading, children }: AuthProviderProps) {
  return <AuthContext.Provider value={{ session, isSessionLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
