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
import React, { useState } from "react";
import { liveblocksConfig } from "@liveblocks/react-lexical";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
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
      <div className="editor-container">
        <div className="flex items-center justify-between rounded-[10px] border-[2px] border-black m-[10px] md:my[10px] md:mx-16 ">
          <ToolbarPlugin />
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

        <div className="editor-inner min-h-[calc(100vh-225px)] sm:min-h-[calc(100vh-135px)] m-[10px] md:my[10px] md:mx-16 rounded-[10px]">
          <div>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input h-full" />
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
}
