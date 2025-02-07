import { useState, useRef } from "react";
import { useKnowledgeBaseStore, useSessionStore } from "../../store";
import { Article, Category } from "../../types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Avatar from "../__shared/Avatar";
import TiptapEditor from './TiptapEditor';
import { createPortal } from "react-dom";

interface ArticleFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  isNewArticle?: boolean;
  article?: Article;
  knowledgeBaseId: string;
  categories: Category[];
}

const CategoryDropdown = ({ 
  isOpen, 
  triggerRef, 
  categories, 
  categoryId, 
  setCategoryId, 
  onClose 
}: {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement>;
  categories: Category[];
  categoryId: string;
  setCategoryId: (id: string) => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  const rect = triggerRef.current?.getBoundingClientRect();
  if (!rect) return null;

  return createPortal(
    <ul 
      className="menu p-2 shadow-lg bg-base-100 rounded-box border border-base-300 w-[var(--width)] max-h-60 overflow-y-auto"
      style={{
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 100,
      }}
    >
      {categories.map((category) => (
        <li key={category.id}>
          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setCategoryId(category.id);
              onClose();
            }}
          >
            <span className="text-xl">{category.emoji_icon}</span>
            <span>{category.name}</span>
          </button>
        </li>
      ))}
    </ul>,
    document.body
  );
};

const ArticleFlyout = ({ 
  isOpen, 
  onClose, 
  isNewArticle,
  article,
  knowledgeBaseId,
  categories,
}: ArticleFlyoutProps) => {
  const { createArticle, updateArticle } = useKnowledgeBaseStore();
  const { session } = useSessionStore();
  const [title, setTitle] = useState(article?.title || "");
  const [description, setDescription] = useState(article?.description || "");
  const [body, setBody] = useState(article?.body || '{"type":"doc","content":[{"type":"paragraph"}]}');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categoryId, setCategoryId] = useState(article?.category_id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        title: title.trim(),
        description: description.trim(),
        body: body.trim(),
        category_id: categoryId,
        knowledgebase_id: knowledgeBaseId,
        org_id: session!.org_id,
        status: isDraft ? "draft" : "published",
        created_by: session!.id,
        last_updated_by: session!.id,
        last_updated_at: new Date().toISOString(),
      };

      if (isNewArticle) {
        await createArticle(articleData);
        toast.success("Article created successfully");
      } else {
        await updateArticle({
          ...articleData,
          id: article!.id,
          created_at: article!.created_at,
          created_by: article!.created_by,
        });
        toast.success("Article updated successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-[95%] max-w-6xl p-2 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex bg-base-100 border border-base-300 rounded-lg shadow-2xl">
        {/* Main Content Column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Left Header */}
          <div className="flex-shrink-0 border-b border-base-300 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {isNewArticle ? "New Article" : "Edit Article"}
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleSave(true)}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSave(false)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    'Publish'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto rounded-lg p-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
                className="w-full text-3xl font-bold mb-4 bg-transparent border-none focus:outline-none"
              />
              <div className="relative mb-8">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 140))}
                  placeholder="Add a brief description..."
                  maxLength={140}
                  className="w-full text-xl font-semibold text-base-content/70 bg-transparent border-none focus:outline-none"
                />
                <div className="absolute right-0 bottom-0 text-xs text-base-content/50">
                  {description.length}/140
                </div>
              </div>
              <TiptapEditor
                content={body}
                onChange={setBody}
              />
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-80 flex-shrink-0 border-l border-base-300 flex flex-col">
          {/* Right Header */}
          <div className="flex-shrink-0 border-b border-base-300 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Details</h2>
            <button 
              className="btn btn-ghost btn-sm px-2"
              onClick={onClose}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Details Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-base-content/70">Status</label>
                <div className="mt-1">
                  <span className="px-2 py-1 text-sm rounded-full bg-base-200">
                    {capitalizeFirstLetter(status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <button
                  type="button"
                  ref={triggerRef}
                  className="select select-bordered w-full flex items-center justify-between"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {categoryId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {categories.find(c => c.id === categoryId)?.emoji_icon}
                      </span>
                      <span>
                        {categories.find(c => c.id === categoryId)?.name}
                      </span>
                    </div>
                  ) : (
                    "Select a category"
                  )}
                </button>
                <CategoryDropdown
                  isOpen={isDropdownOpen}
                  triggerRef={triggerRef}
                  categories={categories}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>

              {!isNewArticle && article && (
                <>
                  <div>
                    <label className="text-sm text-base-content/70">Created by</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar user={session} size={24} />
                      <span className="text-sm">
                        {format(new Date(article.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-base-content/70">Last updated</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar user={session} size={24} />
                      <span className="text-sm">
                        {format(new Date(article.last_updated_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFlyout; 