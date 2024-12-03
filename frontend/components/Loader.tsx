import { LoaderIcon } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center text-black">
      <LoaderIcon className="text-center w-10 h-10 animate-spin mr-3" />
      <h1 className="text-xl font-bold">Loading ...</h1>
    </div>
  );
};

export default Loader;
