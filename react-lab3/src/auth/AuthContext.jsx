// Who is logged in, shared with every component through context (sections 08–10).
//
//   <AuthProvider> … </AuthProvider>                    wraps the whole app (App.jsx)
//   const { user, token, login, logout } = useAuth();   in any component or hook inside it
//
//   user    null, or the logged-in user from GET /api/users/me: { id, email, fullName, role, createdAt }
//   token   null, or the JWT from POST /api/auth/login. Kept in memory (React state) only.
//   login(email, password)  POST /api/auth/login, then GET /api/users/me with the new token,
//                           then store both. On failure it throws the ApiError (401 "Invalid
//                           email or password") and changes nothing.
//   logout()                POST /api/auth/logout with the token (the server revokes it), then
//                           forget the session — even if that call fails.
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

const AuthContext = createContext(null);

// Stretch (section 10): a reload logs you out, because the session lives only in memory.
// To survive a reload, start from what sessionStorage holds, and save every change to it.

export function AuthProvider({ children }) {
  // TODO (section 10): keep the session ({ token, user }) in state, write login() and
  // logout(), and provide { user, token, login, logout } to everything inside.
  return children;
}

export function useAuth() {
  // TODO (section 10): return what the nearest <AuthContext.Provider> holds (useContext).
  // Until then, nobody is ever logged in.
  return { user: null, token: null, login: async () => { throw new Error("TODO: login (section 10)"); }, logout: async () => {} };
}
