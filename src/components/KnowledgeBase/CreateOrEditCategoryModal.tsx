import { useState } from "react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useKnowledgeBaseStore, useSessionStore } from "../../store";
import { Category } from "../../types";
import { toast } from "react-hot-toast";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBaseId: string;
  category?: Category;
}

const EditCategoryModal = ({ isOpen, onClose, knowledgeBaseId, category }: EditCategoryModalProps) => {
  const { createCategory, updateCategory } = useKnowledgeBaseStore();
  const { session } = useSessionStore();
  const [name, setName] = useState(category?.name || "");
  const [emojiIcon, setEmojiIcon] = useState(category?.emoji_icon || "😁");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNewCategory = !category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewCategory) {
        await createCategory({
          name: name.trim(),
          emoji_icon: emojiIcon,
          knowledgebase_id: knowledgeBaseId,
          org_id: session!.org_id,
        });
        toast.success("Category created successfully");
      } else {
        await updateCategory({
          ...category,
          name: name.trim(),
          emoji_icon: emojiIcon,
        });
        toast.success("Category updated successfully");
      }
      
      onClose();
    } catch (error) {
      console.error(`Error ${isNewCategory ? 'creating' : 'updating'} category:`, error);
      toast.error(`Failed to ${isNewCategory ? 'create' : 'update'} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box overflow-visible">
        <h3 className="font-bold text-lg mb-6">
          {isNewCategory ? 'Create Category' : 'Edit Category'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                className="btn text-2xl px-3"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {emojiIcon}
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 left-10 -top-10">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setEmojiIcon(emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    theme={document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Category name"
              className="input input-bordered flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-ghost" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner" />
                  {isNewCategory ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                isNewCategory ? 'Create Category' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">Close</button>
      </div>
    </div>
  );
};

export default EditCategoryModal;
