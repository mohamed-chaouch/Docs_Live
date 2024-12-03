"use server"

import { cookies } from "next/headers";

export async function getUserInfo() {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    return { user: null, errorResponse: "Unauthorized, no token found" };
  }

  try {
    const decodedToken = decodeURIComponent(accessToken);
    const jsonPayload = atob(decodedToken.split(".")[1]);
    const user = JSON.parse(jsonPayload);

    return { user, errorResponse: null };
  } catch (error) {
    console.error("Token parsing error:", error);
    return { user: undefined, errorResponse: "Invalid token" };
  }
}