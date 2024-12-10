"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";
import {
  InboxNotification,
  InboxNotificationList,
  LiveblocksUIConfig,
} from "@liveblocks/react-ui";
import Image from "next/image";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();

  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter(
    (notifcation) => !notifcation.readAt
  );

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

  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative cursor-pointer p-2 w-[40px] h-[100%] rounded-[50%] hover:bg-yellow-1 mr-2 md:mr-4">
                <MessageSquare className="w-6 h-6" />
                {count > 0 && (
                  <div className="absolute right-0 top-0 z-20 w-5 h-5 rounded-full bg-red-500 text-white text-sm font-bold">
                    {count}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-yellow-1 border-0">
              <p>Notification</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="flex items-center justify-center w-[360px] mr-2 sm:mr-16 bg-white"
      >
        <LiveblocksUIConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-gray-600">
                No new notifications.
              </p>
            )}

            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className="w-full flex text-black"
                  href={`/doc/${notification.roomId}`}
                  showActions={false}
                  kinds={{
                    thread: (props) => (
                      <InboxNotification.Thread
                        {...props}
                        showActions={false}
                        showRoomName={false}
                      />
                    ),
                    textMention: (props) => (
                      <InboxNotification.TextMention
                        {...props}
                        showRoomName={false}
                      />
                    ),
                    $documentAccess: (props) => (
                      <InboxNotification.Custom
                        {...props}
                        title={props.inboxNotification.activities[0].data.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                              src={
                                `${process.env.NEXT_PUBLIC_BASE_URL}${(
                                  props.inboxNotification.activities[0].data
                                    .avatar as string
                                )}` || ""
                              }
                              alt="avatar"
                              width={36}
                              height={36}
                              className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    ),
                  }}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
