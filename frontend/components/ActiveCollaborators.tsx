"use client";

import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const ActiveCollaborators = () => {
  const others = useOthers();

  const collaborators = others.map((other) => other.info);

  return (
    <ul className="hidden sm:flex items-center justify-start -space-x-3 overflow-hidden mr-2 md:mr-4">
    {collaborators.map((collaborator, index) => (
      <li
        key={index}
        className="flex items-center"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer rounded-full p-1 z-20">
                <Image
                  src={`${collaborator.avatar}`}
                  alt={collaborator.name}
                  width={26}
                  height={26}
                  className="rounded-full" 
                  style={{
                    border: `3px solid ${collaborator.color}`
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="border-0" style={{ background: collaborator.color }}>
              <p className="text-sm text-black">{collaborator.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    ))}
  </ul>
  );
};

export default ActiveCollaborators;
