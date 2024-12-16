"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import api from "@/utils/axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, LogOut, SquarePen } from "lucide-react";
import useUserInfo from "@/hooks/useUserInfo";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ActiveCollaborators from "./ActiveCollaborators";
import Notifications from "./Notifications";

interface INavBar {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isDoc?: boolean;
  listDoc?: boolean;
  title?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  currentUserType?: UserType;
  updateTitleHandler?: () => void;

  // for sharing
  setSharing?: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavBar = ({
  setOpen,
  isDoc,
  listDoc,
  title,
  setTitle,
  currentUserType,
  updateTitleHandler,
  // for sharing,
  setSharing,
}: INavBar) => {
  const { user } = useUserInfo();
  const router = useRouter();
  const [cookies, , removeCookie] = useCookies(["accessToken"]);
  const logOut = async () => {
    await api.get("/logout", {
      headers: {
        Authorization: `Bearer ${cookies.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    // Remove the accessToken cookie
    // the path is / because i put in the cookies the path equal to /
    removeCookie("accessToken", { path: "/" });
    removeCookie("accessToken", { path: "/doc" });

    router.push("/");
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [removeIcon, setRemoveIcon] = useState(false);
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setRemoveIcon(true);
    }
  };

  const handleBlur = () => {
    setRemoveIcon(false);
    if (updateTitleHandler) {
      updateTitleHandler();
    }
  };

  const inputRef2 = useRef<HTMLInputElement | null>(null);

  const [removeIcon2, setRemoveIcon2] = useState(false);
  const handleClick2 = () => {
    if (inputRef2.current) {
      inputRef2.current.focus();
      setRemoveIcon2(true);
    }
  };

  const handleBlur2 = () => {
    setRemoveIcon2(false);
    if (updateTitleHandler) {
      updateTitleHandler();
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-2 sm:px-12 my-2">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            router.push("/home");
          }}
        >
          <Image src="/icons/note.svg" alt="Note" width={50} height={50} />
          <p className="text-xl font-bold text-black">Live Docs</p>
        </div>
        {isDoc && setTitle && currentUserType === "editor" && (
          <div className="hidden md:flex items-center justify-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={title}
              className="text-xl font-bold text-black bg-transparent outline-none w-fit text-center"
              style={{ width: `${Math.min(Math.max(title!.length * 10, 100), 250)}px` }}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onFocus={handleClick}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  inputRef.current?.blur();
                  if (updateTitleHandler) {
                    updateTitleHandler();
                  }
                }
              }}
            />
            <div
              className={cn(
                "flex items-center justify-center rounded-full w-10 h-10 hover:bg-yellow-1",
                {
                  hidden: removeIcon,
                }
              )}
            >
              <SquarePen
                strokeWidth={3}
                className="w-6 h-6 text-black cursor-pointer"
                onClick={handleClick}
              />
            </div>
          </div>
        )}

        {isDoc && setTitle && currentUserType !== "editor" && (
          <div className="hidden md:flex items-center justify-center space-x-2">
            <p className="text-xl font-bold text-black bg-transparent outline-none w-fit text-center truncate" style={{ width: `${Math.min(Math.max(title!.length * 10, 100), 250)}px` }}>
              {title}
            </p>
            <p className="w-[54px] text-[10px] font-semibold bg-black/20 py-[2px] px-[4px]">
              View Only
            </p>
          </div>
        )}

        <div>
          {setOpen && (
            <Button
              className="bg-yellow-1 hover:bg-yellow-2 px-4 sm:px-8 rounded-[20px] text-black font-bold shadow-2xl"
              onClick={() => {
                setOpen(true);
              }}
            >
              Sign-Up For Free
            </Button>
          )}

          {user && (
            <div className="flex items-center">
              {isDoc && (
                <div className="flex items-center justify-center mr-4 sm:mr-0">
                  <Button
                    className="bg-orange-1 hover:bg-yellow-1 text-1 flex items-center justify-center text-white"
                    onClick={() => {
                      if (setSharing) {
                        setSharing(true);
                      }
                    }}
                    disabled={currentUserType !== "editor"}
                  >
                    <ExternalLink className="w-8 h-8 text-white mr-1" />
                    Share
                  </Button>
                  <ActiveCollaborators />
                </div>
              )}

              {listDoc && <Notifications />}
              {(isDoc || listDoc) && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer rounded-[50%] border-[2px] border-black hover:border-yellow-1">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.imageUrl}`}
                            alt="avatar"
                            width={36}
                            height={36}
                            className="rounded-[50%]"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-yellow-1 border-0">
                        <p>{user.firstName + " " + user.lastName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span onClick={logOut}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer p-2 w-[40px] h-[100%] rounded-[50%] hover:bg-yellow-1 ml-2 md:ml-4">
                            <LogOut className="w-6 h-6" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-yellow-1 border-0">
                          <p>Logout</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {isDoc && setTitle && currentUserType === "editor" && (
        <div className="flex md:hidden items-center justify-center space-x-2 my-4">
          <input
            ref={inputRef2}
            type="text"
            value={title}
            className="text-2xl font-bold text-black bg-transparent outline-none w-fit text-center"
            style={{ width: `${Math.min(Math.max(title!.length * 10, 100), 250)}px` }}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onFocus={handleClick2}
            onBlur={handleBlur2}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                inputRef2.current?.blur();
                if (updateTitleHandler) {
                  updateTitleHandler();
                }
              }
            }}
          />
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-8 h-8 hover:bg-yellow-1",
              {
                hidden: removeIcon2,
              }
            )}
          >
            <SquarePen
              strokeWidth={3}
              className="w-6 h-6 text-black cursor-pointer"
              onClick={handleClick2}
            />
          </div>
        </div>
      )}

      {isDoc && setTitle && currentUserType !== "editor" && (
        <div className="flex md:hidden items-center justify-center my-4">
          <p className="text-2xl font-bold text-black bg-transparent outline-none w-fit text-center truncate"  style={{ width: `${Math.min(Math.max(title!.length * 10, 100), 250)}px` }}>
            {title}
          </p>
          <p className="w-[54px] text-[10px] bg-black/20 py-[2px] px-[4px]">
            View Only
          </p>
        </div>
      )}
    </>
  );
};

export default NavBar;
