// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";
import {
  User,
  Session,
  AuthChangeEvent,
  AuthError,
} from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. Beim Mount: aktuelle Session abfragen
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Listener für Änderungen (Login, Logout, Token-Refresh o. Ä.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Signup: erstellt einen neuen Auth-User in auth.users, speichert Session/Token automatisch
  const signUp = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

  // SignIn: login mit E-Mail + Passwort, Session wird automatisch gesetzt
  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  // SignOut: löscht Session
  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook, um später überall in deiner App `const { user, session, signIn, ... } = useAuth()` zu nutzen.
export const useAuth = () => useContext(AuthContext);
