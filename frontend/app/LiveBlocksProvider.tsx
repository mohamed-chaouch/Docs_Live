"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import api from "@/utils/axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

const LiveBlocsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"])
  return (
    <LiveblocksProvider
      resolveUsers={async ({ userIds }) => {
        if(!cookies.accessToken) router.push("/")
        const response = await api.post("get-users", { userIds: userIds }, {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        return response.data.users;
      }}
      authEndpoint="/api/liveblocks-auth"
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveBlocsProvider;
