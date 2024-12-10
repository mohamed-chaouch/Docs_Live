"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import Loader from "./Loader";
import { Editor } from "./editor/Editor";
import NavBar from "./Navbar";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import DeletePopUp from "./DeletePopUp";
import { useDeleteDocument } from "@/hooks/useDeleteDocument";
import SharePopUp from "./SharePopUp";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [collaborators, setCollaborators] = useState<User[]>(users);
  const [title, setTitle] = useState(roomMetadata.title);

  useEffect(()=>{
    if(collaborators.length === 0){
      setCollaborators(users);
      console.log(collaborators, ": collaborators after setting")
    }
  },[users])

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

  const { deleteDocument, setDeleteDocument, handleDeleteDocument } =
    useDeleteDocument(roomId);

  const [sharing, setSharing] = useState(false);

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
            // for the sharing
            setSharing={setSharing}
          />
          <Editor
            roomId={roomId}
            currentUserType={currentUserType}
            roomMetadata={roomMetadata}
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

        {sharing && (
          <SharePopUp
            isOpen={sharing}
            onClose={() => {
              setSharing(false);
            }}
            roomId={roomId}
            collaborators={collaborators}
            setCollaborators={setCollaborators}
            creatorId={roomMetadata.creatorId}
            currentUserType={currentUserType}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
