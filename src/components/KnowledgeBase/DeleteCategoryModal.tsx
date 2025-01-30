import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { Category } from "../../types";
import { toast } from "react-hot-toast";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

const DeleteCategoryModal = ({ isOpen, onClose, category }: DeleteCategoryModalProps) => {
  const { deleteCategory } = useKnowledgeBaseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Category</h3>
        <p className="mb-6">
          Are you sure you want to delete <span className="font-medium">{category.name}</span>? 
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
              'Delete Category'
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

export default DeleteCategoryModal; 