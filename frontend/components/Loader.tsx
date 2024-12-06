import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import React from "react";

interface LoaderProps {
  className?: string;
}
const Loader = ({className}: LoaderProps) => {
  return (
    <div className={cn("h-screen w-full flex items-center justify-center text-black", className)}>
      <LoaderIcon className="text-center w-10 h-10 animate-spin mr-3" />
      <h1 className="text-xl font-bold">Loading ...</h1>
    </div>
  );
};

export default Loader;
