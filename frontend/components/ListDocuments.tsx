"use client";

import { Pencil, Trash2 } from "lucide-react";
import { dateConverter } from "@/lib/dateConverterRoom";
import { getRandomColor } from "@/lib/userColor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useRouter } from "next/navigation";

import { Room as LiveblocksRoom } from "@liveblocks/client";
import React, { useState } from "react";
import DeletePopUp from "./DeletePopUp";
import { useDeleteDocument } from "@/hooks/useDeleteDocument";
import { Button } from "./ui/button";
import useUserInfo from "@/hooks/useUserInfo";
interface Room extends LiveblocksRoom {
  metadata: RoomMetadata;
  usersAccesses: RoomAccesses;
  createdAt: string;
}

const ListDocuments = ({
  documents,
  setDocuments,
  page,
}: {
  documents: Room[];
  setDocuments: React.Dispatch<React.SetStateAction<Room[]>>;
  page: number;
}) => {
  const router = useRouter();
  const { user } = useUserInfo();

  const [documentId, setDocumentId] = useState("");

  const { deleteDocument, setDeleteDocument, handleDeleteDocument } =
    useDeleteDocument(documentId, setDocuments);

  return (
    <>
      {documents &&
        documents?.length > 0 &&
        documents.map((document, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center rounded-[20px] h-[130px] shadow-2xl ${
              index === documents.length - 1 &&
              ((documents.length === 9 && page !== 1) ||
                (documents.length === 8 && page === 1))
                ? "md:col-span-2 xl:col-span-1"
                : ""
            }`}
            style={{ backgroundColor: getRandomColor(index + 1, page) }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="mt-3 text-xl font-bold w-full text-center px-6 truncate">
                    {document.metadata.title}
                  </h1>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black text-white border-0"
                >
                  <p>{document.metadata.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h2 className="text-lg font-semibold">
              Created about {dateConverter(document.createdAt)}
            </h2>
            <div className="flex items-center justify-center mt-4 gap-x-2">
              <Button
                className="flex items-center justify-center cursor-pointer w-9 h-9 p-2 rounded-full bg-white hover:bg-orange-1 hover:scale-105"
                onClick={() => {
                  router.push(`/doc/${document.id}`);
                }}
              >
                <Pencil className=" text-blue-500" />
              </Button>
              <Button
                className="flex items-center justify-center cursor-pointer w-9 h-9 p-2 rounded-full border-0 bg-white hover:bg-orange-1 hover:scale-110"
                disabled={document.metadata.creatorId !== user?._id}
                onClick={() => {
                  setDeleteDocument(true);
                  setDocumentId(document.id);
                }}
              >
                <Trash2 className=" text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      {deleteDocument && (
        <DeletePopUp
          isOpen={deleteDocument}
          onClose={() => {
            setDeleteDocument(false);
          }}
          handleDeleteDocument={handleDeleteDocument}
        />
      )}
    </>
  );
};

export default ListDocuments;
