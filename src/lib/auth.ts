import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findUserById } from "@/lib/store";

export const AUTH_COOKIE_NAME = "taskflow_token";
const TOKEN_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthTokenPayload = {
  userId: string;
  email: string;
  name: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined. Add it to your .env file.");
  }

  return secret;
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_DURATION_SECONDS
  });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_DURATION_SECONDS
  };
}

export function attachAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    ...getCookieOptions()
  });

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });

  return response;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);

  if (!payload?.userId) {
    return null;
  }

  const user = await findUserById(payload.userId);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
