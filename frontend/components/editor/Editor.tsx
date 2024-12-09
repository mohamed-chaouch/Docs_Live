"use client";

import Theme from "./plugins/Theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
} from "@liveblocks/react-lexical";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Loader from "../Loader";
import FloatingToolbarPlugin from "./plugins/FloatingToolbarPlugin";
import { useThreads } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import Comments from "../Comments";
// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({
  roomId,
  currentUserType,
  setDeleteDocument,
}: {
  roomId: string;
  currentUserType: UserType;
  setDeleteDocument: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [avatarsReady, setAvatarsReady] = useState(false);

  useEffect(() => {
    // Check if avatars are already in the DOM
    const checkAvatars = () => {
      const avatarImages = document.querySelectorAll(".lb-avatar-image");

      if (avatarImages.length > 0) {
        setAvatarsReady(true); // Set to true when avatars are found
        updateAvatars(avatarImages); // Update avatars immediately
      }
    };

    const updateAvatars = (avatarImages: NodeListOf<Element>) => {
      avatarImages.forEach((avatarImage) => {
        if (avatarImage instanceof HTMLImageElement) {
          const currentSrc = avatarImage.src;
          const avatarName = currentSrc.substring(
            currentSrc.lastIndexOf("/") + 1
          );
          avatarImage.src = `${process.env.NEXT_PUBLIC_BASE_URL}${avatarName}`;
        }
      });
    };

    // Check avatars once on component mount
    checkAvatars();

    // Set up an interval to keep checking periodically (in case avatars are added later)
    const intervalId = setInterval(() => {
      checkAvatars();
    }, 500); // Check every 500ms

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const status = useEditorStatus();
  const { threads } = useThreads();
  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === "editor",
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="flex items-center justify-between border-[2px] border-black m-[10px] md:my[10px] md:mx-16 px-2 rounded-[10px]">
          <ToolbarPlugin />
          <div className="border-[0.5px] border-gray-1 h-[60px] mr-2 flex sm:hidden"></div>
          {currentUserType === "editor" && (
            <span
              onClick={() => {
                setDeleteDocument(true);
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center rounded-full w-8 h-8 mr-2 hover:bg-orange-1 cursor-pointer">
                      <Trash className="w-4 h-4 text-red-400 hover:text-red-900" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-orange-1 border-0 text-white"
                  >
                    <p>Delete Document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          )}
        </div>

        <div className="flex justify-start m-[10px] md:my-[10px] md:mx-16 gap-4">
          {status === "not-loaded" || status === "loading" ? (
            <Loader />
          ) : (
            <div className="editor-inner flex-1 w-full lg:w-2.5/3 h-fit min-h-[calc(100vh-225px)] sm:min-h-[calc(100vh-130px)] rounded-[10px]">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === "editor" && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px] p-2 rounded-[10px]" />
            <FloatingThreads
              threads={threads}
              className="w-[350px] p-2 rounded-[10px]"
            />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
