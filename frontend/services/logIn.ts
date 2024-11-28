"use server";

import api from "@/utils/axios";
import { NextResponse } from "next/server";

export const logIn = async (email: string, password: string) => {
  const response = await api.post("login-user", {
    email: email,
    password: password,
  });

  const expiresAccessToken = new Date(Date.now() + 15 * 60 * 1000); // expire in 15 min

  const expiresRefreshToken = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // expire in 90 days

  const res = NextResponse.json({ message: "Logged in successfully" });

  res.cookies.set("accessToken", response.data.accessToken, {
    expires: expiresAccessToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.cookies.set("refreshToken", response.data.refreshToken, {
    expires: expiresRefreshToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};
