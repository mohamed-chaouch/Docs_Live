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
import useUserInfo from "@/hooks/useUserInfo";

const LiveBlocsProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const { user } = useUserInfo();

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        if (!cookies.accessToken) {
          router.push("/");
          return [];
        }

        const uniqueUserIds = [...new Set(userIds)];

        const response = await api.post(
          "get-users",
          { userIds: uniqueUserIds },
          {
            headers: {
              Authorization: `Bearer ${cookies.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const users = response.data.users.map((user: User) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }));

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        if (!cookies.accessToken || !user) {
          router.push("/");
        }
      
        const response = await api.get(
          `document/get-document-users/${roomId}?text=${text}&email=${user.email!}`
        );
      
        return response.data.roomUsers;
      }}      
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default LiveBlocsProvider;
