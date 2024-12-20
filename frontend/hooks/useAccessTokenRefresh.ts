"use client";

import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import api from "@/utils/axios";

export const useAccessTokenRefresh = () => {
  const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"]);
  const [cookiesLoaded, setCookiesLoaded] = useState(false);

  useEffect(() => {
    // Make sure cookies are set before we consider them loaded
    if (cookies.accessToken && cookies.refreshToken) {
      setCookiesLoaded(true);
    }
  }, [cookies]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = cookies.refreshToken;

      if (!refreshToken) {
        console.error("No refresh token found in cookies.");
        return null;
      }

      const response = await api.post("/refresh-token", {
        refreshToken: refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      const expiresAccessToken = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

      setCookie("accessToken", newAccessToken, {
        expires: expiresAccessToken,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const checkAndRefreshToken = async () => {
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return;
    }

    try {
      // Decode the token (without using a library)
      const decodedToken = decodeURIComponent(accessToken);
      const jsonPayload = atob(decodedToken.split(".")[1]);
      const tokenData = JSON.parse(jsonPayload);

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const tokenExpirationTime = tokenData.exp; // Expiration time from token
      const timeRemaining = tokenExpirationTime - currentTime;

      if (timeRemaining <= 5 * 60) {
        // Refresh if the token is expiring in 5 minutes
        await refreshAccessToken();
      }
    } catch (error) {
      console.error("Error decoding token or refreshing:", error);
    }
  };

  return {
    checkAndRefreshToken,
    cookiesLoaded,
  };
};
