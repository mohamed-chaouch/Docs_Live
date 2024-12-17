"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import Collaborator from "./Collaborator";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import useUserInfo from "@/hooks/useUserInfo";
import { useSelf } from "@liveblocks/react/suspense";

const SharePopUp = ({
  isOpen,
  onClose,
  roomId,
  collaborators,
  setCollaborators,
  creatorId,
}: SharePopUpProps) => {
  const userSelf = useSelf();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");

  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();

  const { user } = useUserInfo();

  const handleUsers = async (usersAccesses: RoomAccesses) => {
    const userIds = Object.keys(usersAccesses);

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
      userType: (usersAccesses[user.email] as string[])?.includes("room:write")
        ? "editor"
        : "viewer",
    }));

    setCollaborators(usersData);
  };

  const handleShareDocument = async () => {
    try {
      if (!user || !cookies.accessToken) return router.push("/");
      setLoading(true);
      
      const responseRoom = await api.put(
        `document/update-document-access/${roomId}/${email}/${userType}`,
        { updatedBy: userSelf.info }
      );

      handleUsers(responseRoom.data.room.usersAccesses);

      setEmail("");
      setUserType("viewer");
    } catch (error) {
      console.error("Error sharing document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!bg-white md:rounded-[10px] border-0 p-4 max-h-[90vh] overflow-auto rounded-[10px] w-full">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-sm font-bold">Email</p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-full relative">
              <input
                type="email"
                placeholder="test@gmail.com"
                className="w-full p-2 pr-28 text-black outline-none rounded-[8px] shadow-2xl bg-gray-1"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <UserTypeSelector userType={userType} setUserType={setUserType} />
            </div>
            <Button
              className="bg-orange-1 hover:bg-yellow-1"
              disabled={loading}
              onClick={handleShareDocument}
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
          <div className="flex flex-col my-2 gap-y-2">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                collaborator={collaborator}
                handleUsers={handleUsers}
                creatorId={creatorId}
                email={collaborator.email}
                user={userSelf.info}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePopUp;
