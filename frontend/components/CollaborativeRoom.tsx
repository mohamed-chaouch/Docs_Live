"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import Loader from "./Loader";
import { Editor } from "./editor/Editor";
import NavBar from "./Navbar";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import DeletePopUp from "./DeletePopUp";
import { useDeleteDocument } from "@/hooks/useDeleteDocument";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {

  const [title, setTitle] = useState(roomMetadata.title);

  const updateTitleHandler = async () => {
    try {
      if (title !== roomMetadata.title) {
        const response = await api.put(
          `document/update-title-document/${roomId}/${title}`
        );
        setTitle(response.data.data.metadata.title);
      }
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const {
    deleteDocument,
    setDeleteDocument,
    handleDeleteDocument,
  } = useDeleteDocument(roomId);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div>
          <NavBar
            isDoc={true}
            title={title}
            setTitle={setTitle}
            currentUserType={currentUserType}
            updateTitleHandler={updateTitleHandler}
          />
          <Editor
            roomId={roomId}
            currentUserType={currentUserType}
            setDeleteDocument={setDeleteDocument}
          />
        </div>

        {deleteDocument && (
          <DeletePopUp
            isOpen={deleteDocument}
            onClose={() => {
              setDeleteDocument(false);
            }}
            handleDeleteDocument={handleDeleteDocument}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
