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
  const [cookies] = useCookies(["accessToken"]);
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        if (!cookies.accessToken) router.push("/");
        const response = await api.post(
          "get-users",
          { userIds: userIds },
          {
            headers: {
              Authorization: `Bearer ${cookies.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.users;
      }}
      resolveMentionSuggestions={async ({ text, roomId })=> {
        const response = await api.get(`document/get-document-users/${roomId}/${text}`)

        return response.data.roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveBlocsProvider;
