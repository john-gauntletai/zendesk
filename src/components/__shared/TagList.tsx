import { Conversation, Tag } from "../../types";
import { useState, useRef, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTagsStore, useConversationStore } from "../../store";
import Portal from "./Portal";

interface TagListProps {
  conversation: Conversation;
  showAddButton?: boolean;
}

// Helper function to get name length excluding emojis
const getNameLengthWithoutEmoji = (name: string) => {
  // This regex matches emoji characters
  const emojiRegex = /\p{Emoji}/gu;
  return name.replace(emojiRegex, '').length;
};

const TagList = ({ conversation, showAddButton = false }: TagListProps) => {
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagSelectorPosition, setTagSelectorPosition] = useState({
    top: 0,
    left: 0,
  });
  const [tagActionPosition, setTagActionPosition] = useState({
    top: 0,
    left: 0,
  });

  const { tags } = useTagsStore();
  const { addTagToConversation, removeTagFromConversation } =
    useConversationStore();

  const tagSelectorTriggerRef = useRef<HTMLButtonElement>(null);
  const tagSelectorRef = useRef<HTMLDivElement>(null);
  const tagActionRef = useRef<HTMLDivElement>(null);

  // Sort tags by name length (excluding emojis), then alphabetically for same lengths
  const sortedTags = [...tags].sort((a, b) => {
    const aLength = getNameLengthWithoutEmoji(a.name);
    const bLength = getNameLengthWithoutEmoji(b.name);
    const lengthDiff = aLength - bLength;
    return lengthDiff === 0 ? a.name.localeCompare(b.name) : lengthDiff;
  });

  const filteredTags = sortedTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (tagSelectorRef.current &&
          !tagSelectorRef.current.contains(event.target as Node) &&
          !tagSelectorTriggerRef.current?.contains(event.target as Node)) ||
        (tagActionRef.current &&
          !tagActionRef.current.contains(event.target as Node))
      ) {
        setIsTagSelectorOpen(false);
        setSelectedTagId(null);
        setTagSearch("");
      }
    };

    const updateTagSelectorPosition = () => {
      if (tagSelectorTriggerRef.current) {
        const rect = tagSelectorTriggerRef.current.getBoundingClientRect();
        setTagSelectorPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        });
      }
    };

    const updateTagActionPosition = (tagElement: HTMLElement) => {
      const rect = tagElement.getBoundingClientRect();
      setTagActionPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    };

    if (isTagSelectorOpen || selectedTagId) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener(
        "scroll",
        () => {
          if (isTagSelectorOpen) updateTagSelectorPosition();
          if (selectedTagId) {
            const tagElement = document.querySelector(
              `[data-tag-id="${selectedTagId}"]`
            );
            if (tagElement) updateTagActionPosition(tagElement as HTMLElement);
          }
        },
        true
      );
      window.addEventListener("resize", () => {
        if (isTagSelectorOpen) updateTagSelectorPosition();
        if (selectedTagId) {
          const tagElement = document.querySelector(
            `[data-tag-id="${selectedTagId}"]`
          );
          if (tagElement) updateTagActionPosition(tagElement as HTMLElement);
        }
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", updateTagSelectorPosition, true);
      window.removeEventListener("resize", updateTagSelectorPosition);
    };
  }, [isTagSelectorOpen, selectedTagId]);

  const handleTagClick = (
    event: React.MouseEvent,
    tagId: string,
    element: HTMLElement
  ) => {
    event.stopPropagation();
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
    } else {
      setSelectedTagId(tagId);
      setTagActionPosition({
        top: element.getBoundingClientRect().bottom + window.scrollY + 4,
        left: element.getBoundingClientRect().left + window.scrollX,
      });
    }
  };

  const handleAddTag = async (tag: Tag) => {
    await addTagToConversation(conversation.id, tag.id);
    setIsTagSelectorOpen(false);
    setTagSearch("");
  };

  const handleRemoveTag = async (event: React.MouseEvent, tagId: string) => {
    event.preventDefault();
    event.stopPropagation();
    await removeTagFromConversation(conversation.id, tagId);
    setSelectedTagId(null);
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {conversation?.tags?.sort((a, b) => {
        const aLength = getNameLengthWithoutEmoji(a.name);
        const bLength = getNameLengthWithoutEmoji(b.name);
        const lengthDiff = aLength - bLength;
        return lengthDiff === 0 ? a.name.localeCompare(b.name) : lengthDiff;
      }).map((tag) => (
        <span
          key={tag.id}
          data-tag-id={tag.id}
          onClick={(e) => handleTagClick(e, tag.id, e.currentTarget)}
          className="text-xs px-2 py-0.5 rounded-full font-semibold cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: tag.background_color,
            color: tag.text_color,
          }}
        >
          {tag.name}
        </span>
      ))}

      {selectedTagId && (
        <Portal>
          <div
            ref={tagActionRef}
            style={{
              position: "absolute",
              top: tagActionPosition.top,
              left: tagActionPosition.left,
            }}
            className="z-50 w-32 bg-base-100 rounded-lg shadow-lg border border-base-300"
          >
            <button
              type="button"
              onClick={(e) => handleRemoveTag(e, selectedTagId)}
              className="w-full px-3 py-2 text-left hover:bg-base-200 flex items-center gap-2 text-error"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="text-sm">Remove</span>
            </button>
          </div>
        </Portal>
      )}

      {showAddButton && (
        <>
          <button
            ref={tagSelectorTriggerRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsTagSelectorOpen(!isTagSelectorOpen);
              setSelectedTagId(null);
              if (!isTagSelectorOpen) {
                const rect =
                  tagSelectorTriggerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTagSelectorPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX,
                  });
                }
              }
            }}
            className="btn btn-ghost btn-xs"
          >
            <PlusIcon className="w-4 h-4" /> Add Tag
          </button>

          {isTagSelectorOpen && (
            <Portal>
              <div
                ref={tagSelectorRef}
                style={{
                  position: "absolute",
                  top: tagSelectorPosition.top,
                  left: tagSelectorPosition.left,
                }}
                className="z-50 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300"
              >
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    className="input input-sm input-bordered w-full"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredTags.length === 0 ? (
                    <div className="p-2 text-sm text-base-content/70 text-center">
                      No tags found
                    </div>
                  ) : (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleAddTag(tag)}
                        className="w-full px-3 py-2 text-left hover:bg-base-200 flex items-center gap-2"
                      >
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: tag.background_color,
                            color: tag.text_color,
                          }}
                        >
                          {tag.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Portal>
          )}
        </>
      )}
    </div>
  );
};

export default TagList;
