"use client";

import { useMemo } from "react";
import { useCookies } from "react-cookie";

export default function useUserInfo() {
  const [cookies] = useCookies(["accessToken"]);

  const userInfo = useMemo(() => {
    if (!cookies.accessToken) {
      return {
        user: null,
        errorResponse: "Unauthorized, no token found",
        accessToken: undefined,
      };
    }
    
    try {
      const decodedToken = decodeURIComponent(cookies.accessToken);
      const jsonPayload = atob(decodedToken.split(".")[1]);
      const user = JSON.parse(jsonPayload);

      return { user, errorResponse: null, accessToken: cookies.accessToken };
    } catch (error) {
      console.error("Token parsing error:", error);
      return {
        user: undefined,
        errorResponse: "Invalid token",
        accessToken: undefined,
      };
    }
  }, [cookies.accessToken]);

  return userInfo;
}
