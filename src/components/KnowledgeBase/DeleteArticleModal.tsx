import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { Article } from "../../types";
import { toast } from "react-hot-toast";

interface DeleteArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

const DeleteArticleModal = ({ isOpen, onClose, article }: DeleteArticleModalProps) => {
  const { deleteArticle } = useKnowledgeBaseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteArticle(article.id);
      toast.success("Article deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Article</h3>
        <p className="mb-6">
          Are you sure you want to delete <span className="font-medium">{article.title}</span>? 
          This action cannot be undone.
        </p>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner" />
                Deleting...
              </>
            ) : (
              'Delete Article'
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">Close</button>
      </div>
    </div>
  );
};

export default DeleteArticleModal; 