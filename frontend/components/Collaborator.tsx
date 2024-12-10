"use client";

import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import api from "@/utils/axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import useUserInfo from "@/hooks/useUserInfo";

const Collaborator = ({
  collaborator,
  handleUsers,
  creatorId,
  roomId,
  email,
  user,
}: CollaboratorProps) => {
  const [cookies] = useCookies(["accessToken"]);
  const router = useRouter();

  const [userType, setUserType] = useState(collaborator.userType || "viewer");

  const [loading, setLoading] = useState(false);
  const handleShareDocument = async (userType: UserType) => {
    try {
      if (!cookies.accessToken) return router.push("/");
      setLoading(true);

      const responseRoom = await api.put(
        `document/update-document-access/${roomId}/${email}/${userType}`,
        {updatedBy: user}
      );

      handleUsers(responseRoom.data.room.usersAccesses);
    } catch (error) {
      console.error("Error sharing document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocumentUser = async (email: string) => {
    try {
      if (!cookies.accessToken) return router.push("/");
      setLoading(true);

      const responseRoom = await api.delete(
        `document/remove-collaborator/${roomId}/${email}`
      );

      handleUsers(responseRoom.data.room.usersAccesses);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={collaborator.id}
      className="flex items-center justify-between mt-2"
    >
      <div className="flex items-center justify-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_URL}${collaborator.avatar}`}
          alt={collaborator.name}
          width={36}
          height={36}
          className="rounded-full mr-2"
        />
        <div className="flex flex-col items-start justify-center">
          <p>{collaborator.name}</p>
          <p className="text-sm text-black/60">{collaborator.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-center relative">
        {collaborator.id !== creatorId ? (
          <>
            <UserTypeSelector
              userType={userType}
              setUserType={setUserType}
              onHandleClick={handleShareDocument}
              className="right-[84px] !bg-white"
            />
            <Button
              variant="outline"
              className="text-red-500 border-0 hover:text-red-900 hover:bg-white"
              onClick={() => {
                handleDeleteDocumentUser(collaborator.email);
              }}
            >
              Remove
            </Button>
          </>
        ) : (
          <p className="text-sm font-bold mr-3">Owner</p>
        )}
      </div>
    </div>
  );
};

export default Collaborator;
