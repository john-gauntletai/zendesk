import { Conversation, Tag } from "../types";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useTagsStore, useConversationStore } from "../store";
import toast from "react-hot-toast";

interface TagListProps {
  conversation: Conversation;
  showAddButton?: boolean;
}

const TagList = ({ conversation, showAddButton = false }: TagListProps) => {
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const { tags } = useTagsStore();
  const { addTagToConversation } = useConversationStore();

  const handleAddTag = async (tag: Tag) => {
    await addTagToConversation(conversation.id, tag.id);
    setIsTagSelectorOpen(false);
    setTagSearch("");
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
    !conversation?.tags?.some(t => t.id === tag.id)
  );

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {conversation.tags?.map((tag) => (
        <span
          key={tag.id}
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: tag.background_color,
            color: tag.text_color
          }}
        >
          {tag.name}
        </span>
      ))}
      
      {showAddButton && (
        <div className="relative">
          <button
            onClick={() => setIsTagSelectorOpen(!isTagSelectorOpen)}
            className="btn btn-ghost btn-xs"
          >
            <PlusIcon className="w-4 h-4" /> Add Tag
          </button>

          {isTagSelectorOpen && (
            <div className="absolute z-10 mt-1 w-64 bg-base-100 rounded-lg shadow-lg border border-base-300">
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
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.background_color }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagList; 