import { Conversation } from "../types";

interface ConversationStatusBadgeProps {
  conversation: Conversation;
}

const ConversationStatusBadge = ({ conversation }: ConversationStatusBadgeProps) => {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase ${
        conversation.status === "open"
          ? "bg-error/20 text-error"
          : "bg-success/20 text-success"
      }`}
    >
      {conversation.status}
    </span>
  );
};

export default ConversationStatusBadge; 