"use client";

import { Button } from "@/components/ui/button";
import NavBar from "../components/Navbar";
import { useState } from "react";
import PopUpRegistration from "@/components/PopUpRegistration";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <main className="relative min-h-screen">
      <NavBar setOpen={setOpenModal} />

      {/* Intro Section */}
      <div className="h-[calc(100vh-150px)] md:h-fit flex flex-col text-center items-center justify-center md:mt-6 ">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
          Welcome to Document Creator
        </h1>
        <p className="text-md sm:text-lg text-gray-500 mt-2 sm:mt-4 max-w-md mx-auto">
          Create, edit, and manage your documents effortlessly.
        </p>
        <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-sm mx-auto italic">
          Collaborate with others in real-time and boost productivity.
        </p>
        <div className="mt-4 flex items-center justify-center">
        <Button
          className="px-6 py-2 rounded-[8px] text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 shadow-2xl text-sm font-bold transition-transform transform hover:scale-105"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Start a blank document
        </Button>
      </div>
      </div>

      {/* Button Section */}
      

      {/* Zigzag Background Section */}
      <div className="absolute bottom-0 w-full h-1/5 md:h-2/4 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden">
        {/* Zigzag Effect */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="absolute top-[-50px] w-full h-[100px] text-yellow-400"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L720 100 L1440 0 V100 H0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex mt-8 md:mx-[50px] xl:mx-[220px] bg-cover border-orange-1 border-[5px] rounded-tr-[20px] rounded-tl-[20px] md:min-h-[calc(100vh-315px)] xl:min-h-[calc(100vh-200px)] relative z-10">
        <picture>
          <source srcSet="/images/document.png" media="(min-width: 1280px)" />
          <source srcSet="/images/document1.png" media="(min-width: 768px)" />
          <img
            src="/images/document2.png"
            alt="Edit"
            className="w-full md:min-h-[calc(100vh-315px)] xl:min-h-[calc(100vh-200px)] object-fill pt-[4px] px-2"
          />
        </picture>
      </div>

      {openModal && (
        <PopUpRegistration
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </main>
  );
}
