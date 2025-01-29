import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { useSessionStore } from "../../store";
import { toast } from "react-hot-toast";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBaseId: string;
}

const CreateCategoryModal = ({ isOpen, onClose, knowledgeBaseId }: CreateCategoryModalProps) => {
  const { createCategory } = useKnowledgeBaseStore();
  const { session } = useSessionStore();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCategory({
        name: name.trim(),
        knowledgebase_id: knowledgeBaseId,
        org_id: session!.org_id,
      });
      
      toast.success("Category created successfully");
      onClose();
      setName("");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-6">Create Category</h3>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={() => {
              onClose();
              setName("");
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner" />
                Creating...
              </>
            ) : (
              'Create Category'
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

export default CreateCategoryModal; 