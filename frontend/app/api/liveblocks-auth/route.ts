import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/userColor";
import { getUserInfo } from "@/services/getUserInfo";
import { redirect } from "next/navigation";

export async function POST() {
  // Get the current user from your database
  const { user } = await getUserInfo();
  if (!user) redirect("/");

  const liveBlocksUser = {
    id: user._id,
    info : {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: `${process.env.NEXT_PUBLIC_BASE_URL}${user.imageUrl}`,
        color: getUserColor(user._id)
    }
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: liveBlocksUser.info.email,
      groupIds: [],
    },
    { userInfo: liveBlocksUser.info }
  );

  return new Response(body, { status });
}
