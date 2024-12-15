"use client";

import useUserInfo from "@/hooks/useUserInfo";
import api from "@/utils/axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useCookies } from "react-cookie";

const AddNewDocument = () => {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);

  const { user } = useUserInfo();

  const addDocumentHandler = async () => {

    if(!cookies.accessToken || !user) router.push("/");

    const response = await api.post(
      `document/create-document/${user?._id}/${user?.email}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${cookies.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    router.push(`/doc/${response.data.data.id}`);
  };
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[20px] h-[130px] bg-gray-1 shadow-2xl cursor-pointer hover:scale-[105]>"
      onClick={addDocumentHandler}
    >
      <div className="w-10 h-10 rounded-[50%] bg-orange-1 flex items-center justify-center">
        <Plus strokeWidth={3} className="w-6 h-6 text-white" />
      </div>
      <h1 className="mt-3 text-xl font-bold">
        Add New <br></br>Document
      </h1>
    </div>
  );
};

export default AddNewDocument;
