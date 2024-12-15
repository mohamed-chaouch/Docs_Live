import { cn } from "@/lib/utils";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);
  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "rounded-[10px]",
        isActive && "shadow-md",
        thread.resolved && "opacity-40"
      )}
    />
  );
};

const Comments = () => {
  const { threads } = useThreads();

  return (
    <div className="flex flex-col gap-y-0.5 w-full lg:w-[350px]">
      <Composer className="p-2 rounded-[10px]" />
      
      {threads.map((thread) => (
        <ThreadWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;
