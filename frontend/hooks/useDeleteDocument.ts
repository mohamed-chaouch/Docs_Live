"use client";

import api from "@/utils/axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

import { Room as LiveblocksRoom } from "@liveblocks/client";
import useUserInfo from "./useUserInfo";
interface Room extends LiveblocksRoom {
  metadata: RoomMetadata;
  usersAccesses: RoomAccesses;
  createdAt: string;
}

export const useDeleteDocument = (
  roomId: string,
  setDocuments?: React.Dispatch<React.SetStateAction<Room[]>>
) => {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);

  const { user } = useUserInfo();

  const handleDocumentsByUser = async () => {
    const response = await api.get(
      `document/get-documents-by-user/${user?.email}?limit=8&page=1`,
      {
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (setDocuments) {
      setDocuments(response.data.rooms);
    }
  };

  const [deleteDocument, setDeleteDocument] = useState(false);

  const handleDeleteDocument = async () => {
    try {
      if (!cookies.accessToken){
        router.push("/");
      } 
      await api.delete(`document/delete-document/${roomId}`, {
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      handleDocumentsByUser();
      router.push("/home");
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setDeleteDocument(false);
    }
  };

  return {
    deleteDocument,
    setDeleteDocument,
    handleDeleteDocument,
  };
};
