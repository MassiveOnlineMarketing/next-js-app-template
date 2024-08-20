
import { cn } from "@/presentation/components/utils";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

type MessageFromTeamProps = {
  heading: string;
  message: string;
  className?: string;
};

const MessageFromTeam = ({
  heading,
  message,
  className,
}: MessageFromTeamProps) => {
  return (
    <div
      className={cn(
        "p-6 bg-white rounded-2xl shadow-base flex gap-2 dark:bg-dark-bg-light dark:border dark:border-dark-stroke",
        className,
      )}
    >
      <ChatBubbleBottomCenterTextIcon className="min-w-6 h-6 text-gray-700 mt-1 flex-0 dark:text-dark-text-light" />
      <div>
        <p className="mb-2 font-medium text-lg text-gray-800 dark:text-dark-text-light">{heading}</p>
        <p
          className="text-sm text-gray-500 dark:text-dark-text-dark"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
};

export default MessageFromTeam;