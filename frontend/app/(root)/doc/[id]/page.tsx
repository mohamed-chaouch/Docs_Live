"use client";

import CollaborativeRoom from "@/components/CollaborativeRoom";
import useUserInfo from "@/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import api from "@/utils/axios";

import { Room as LiveblocksRoom } from "@liveblocks/client";
interface Room extends LiveblocksRoom {
  metadata: RoomMetadata;
  usersAccesses: RoomAccesses;
  createdAt: string;
}

const Document = ({ params: {id} }: { params: { id: string } }) => {
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();
  const { user } = useUserInfo();

  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState([]);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user || !cookies.accessToken) {
      router.push("/");
    }
  }, [user, cookies.accessToken]);

  // Fetch room data
  useEffect(() => {
    if (id && user?.email) {
      const handleDocument = async () => {
        const response = await api.get(
          `document/get-document/${user.email}/${id}`
        );
        setRoom(response.data.data);

        if (!response.data.data) {
          router.push("/");
        }
      };

      handleDocument();
    }
  }, [id, user?.email]);

  const [currentUserType, setCurrentUserType] = useState<UserType>("viewer");

  // Fetch user data
  useEffect(() => {
    if (room && cookies.accessToken) {
      const userIds = Object.keys(room.usersAccesses);

      const handleUsers = async () => {
        const response = await api.post(
          "get-users",
          { userIds },
          {
            headers: {
              Authorization: `Bearer ${cookies.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const usersData = response.data.users.map((user: User) => ({
          ...user,
          userType: room.usersAccesses[user.email]?.includes(["room:write"])
            ? "editor"
            : "viewer",
        }));

        setUsers(usersData);

        setCurrentUserType(
          room.usersAccesses[user.email]?.includes(["room:write"])
            ? "editor"
            : "viewer"
        );
      };

      handleUsers();
    }
  }, [room, cookies.accessToken, user]);

  // Ensure room data is loaded
  if (!room) {
    return null; // Render nothing while loading
  }

  return (
    <div>
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={users}
        currentUserType={currentUserType}
      />
    </div>
  );
};

export default Document;
