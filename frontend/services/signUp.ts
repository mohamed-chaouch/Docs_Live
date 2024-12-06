"use server";

import api from "@/utils/axios";
import { cookies } from "next/headers";

export const signUp = async (fd: FormData) => {
  try {
    const response = await api.post("create-user", fd);
    const expiresAccessToken = new Date(Date.now() + 15 * 60 * 1000); // expire in 15 min

    const expiresRefreshToken = new Date(Date.now() + 30 * 60 * 60 * 1000); // expire in 90 days

    cookies().set("accessToken", response.data.accessToken, {
      expires: expiresAccessToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    cookies().set("refreshToken", response.data.refreshToken, {
      expires: expiresRefreshToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

  } catch (error) {
    console.error("Error during sign-up:", error);
    return { success: false, message: "Sign-up failed" };
  }
};
