"use client"

import { Button } from "@/components/ui/button";
import NavBar from "../components/Navbar";
import { useState } from "react";
import PopUpRegistration from "@/components/PopUpRegistration";

export default function Home() {

  const [openModal, setOpenModal] = useState(false)

  return (
    <main>
      <NavBar setOpen={setOpenModal} />
      <div className="mt-4 flex items-center justify-center">
        <Button className="px-6 py-2 rounded-[8px] text-black bg-gradient-to-r from-yellow-1 to-yellow-2 hover:text-gray-700 shadow-2xl text-sm font-bold" onClick={()=>{
          setOpenModal(true);
        }}>
          Start a blank document
        </Button>
      </div>
      <div className="mt-8 min-h-[calc(100vh-147px)] mx-1 sm:mx-[290px] bg-cover border-yellow-1 border-[3px] rounded-tr-[20px] rounded-tl-[20px]">
        <img src="/images/document.png" alt="Edit" className="w-full pt-[4px] px-[4px] min-h-[calc(100vh-152px)]"  />
      </div>


      {
        openModal &&
        <PopUpRegistration isOpen={openModal}  onClose={() => setOpenModal(false)} />
      }
    </main>
  );
}
