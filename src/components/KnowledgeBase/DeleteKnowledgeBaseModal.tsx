import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { KnowledgeBase } from "../../types";
import { toast } from "react-hot-toast";

interface DeleteKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBase;
}

const DeleteKnowledgeBaseModal = ({ isOpen, onClose, knowledgeBase }: DeleteKnowledgeBaseModalProps) => {
  const { deleteKnowledgeBase } = useKnowledgeBaseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteKnowledgeBase(knowledgeBase.id);
      toast.success("Knowledge base deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast.error("Failed to delete knowledge base");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">Delete Knowledge Base</h3>
        <p className="text-base-content/70 mb-6">
          Are you sure you want to delete "{knowledgeBase.name}"? This action cannot be undone.
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
              'Delete Knowledge Base'
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

export default DeleteKnowledgeBaseModal; 