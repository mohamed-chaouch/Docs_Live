"use client";

import { useAccessTokenRefresh } from "@/hooks/useAccessTokenRefresh";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const { checkAndRefreshToken, cookiesLoaded } = useAccessTokenRefresh();

  useEffect(() => {
    if (cookiesLoaded) {
      const intervalId = setInterval(() => {
        checkAndRefreshToken();
      }, 60 * 1000); // Check every minute

      return () => clearInterval(intervalId);
    }
  }, [cookiesLoaded, checkAndRefreshToken]);

  return <main>{children}</main>;
};

export default Layout;
