import { useState, useRef, useEffect } from "react";
import { Conversation } from "../../types";
import { useConversationStore } from "../../store";
import Portal from "./Portal";

interface ConversationStatusBadgeProps {
  conversation: Conversation;
}

const STATUSES = ["open", "closed"];

const ConversationStatusBadge = ({ conversation }: ConversationStatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { updateConversation } = useConversationStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4, // 4px gap
          left: rect.left + window.scrollX,
        });
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      updatePosition();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleStatusChange = async (status: string) => {
    await updateConversation(conversation.id, { status });
    setIsOpen(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`text-xs px-2 py-0.5 rounded-md font-bold uppercase cursor-pointer hover:opacity-80 ${
          conversation.status === "open"
            ? "bg-base-300 text-base-content"
            : "bg-success/20 text-success"
        }`}
      >
        {conversation.status}
      </span>

      {isOpen && (
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            className="z-50 w-32 bg-base-100 rounded-lg shadow-lg border border-base-300"
          >
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(status);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-base-200 text-sm capitalize ${
                  status === conversation.status 
                    ? "font-bold text-primary" 
                    : "text-base-content"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </Portal>
      )}
    </>
  );
};

export default ConversationStatusBadge; 