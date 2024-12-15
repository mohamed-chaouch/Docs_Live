"use client";

import CollaborativeRoom from "@/components/CollaborativeRoom";
import useUserInfo from "@/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import api from "@/utils/axios";

import { Room as LiveblocksRoom } from "@liveblocks/client";
import { RoomAccesses } from "@liveblocks/node";
import Loader from "@/components/Loader";
interface Room extends LiveblocksRoom {
  metadata: RoomMetadata;
  usersAccesses: RoomAccesses;
  createdAt: string;
}

const Document = ({ params: { id } }: { params: { id: string } }) => {
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();
  const { user } = useUserInfo();

  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch room data
  const fetchDocument = useCallback(async () => {
    if (!id || !user?.email) return;

    try {
      const response = await api.get(
        `document/get-document/${user.email}/${id}`
      );
      const fetchedRoom = response.data.data;

      if (!fetchedRoom) {
        router.push("/");
        return;
      }

      setRoom(fetchedRoom);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }, [id, user?.email]);

  const [currentUserType, setCurrentUserType] = useState<UserType>("viewer");

  // Fetch user data
  const fetchUsers = useCallback(async () => {
    if (!room || !cookies?.accessToken || !user) return;

    try {
      const userIds = Object.keys(room.usersAccesses);
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
        userType: (room.usersAccesses[user.email] as string[])?.includes(
          "room:write"
        )
          ? "editor"
          : "viewer",
      }));

      setUsers(usersData);
      setCurrentUserType(
        (room.usersAccesses[user.email] as string[]).includes("room:write")
          ? "editor"
          : "viewer"
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [room, cookies?.accessToken, user]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Ensure room data is loaded
  if (!room) {
    return <Loader />;
  }

  return (
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={users}
        setUsers={setUsers}
        currentUserType={currentUserType}
      />
  );
};

export default Document;
