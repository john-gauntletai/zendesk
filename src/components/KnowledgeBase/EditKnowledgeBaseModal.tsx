import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { KnowledgeBase } from "../../types";
import { toast } from "react-hot-toast";

interface EditKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBase;
}

const EditKnowledgeBaseModal = ({ isOpen, onClose, knowledgeBase }: EditKnowledgeBaseModalProps) => {
  const { updateKnowledgeBase } = useKnowledgeBaseStore();
  const [name, setName] = useState(knowledgeBase.name);
  const [description, setDescription] = useState(knowledgeBase.description || "");
  const [logoUrl, setLogoUrl] = useState(knowledgeBase.logo_url || "");
  const [themeColor, setThemeColor] = useState(knowledgeBase.theme_color || "#000000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateKnowledgeBase({
        ...knowledgeBase,
        name: name.trim(),
        description: description.trim() || null,
        logo_url: logoUrl.trim() || null,
        theme_color: themeColor,
      });
      
      toast.success("Knowledge base updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      toast.error("Failed to update knowledge base");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-6">Edit Knowledge Base</h3>
        
        <div className="form-control gap-4">
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter knowledge base name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter knowledge base description"
              className="textarea textarea-bordered w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Logo URL</span>
            </label>
            <input
              type="text"
              placeholder="Enter logo URL"
              className="input input-bordered w-full"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Theme Color</span>
            </label>
            <input
              type="color"
              className="w-full h-12 rounded-lg cursor-pointer"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
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
                Saving...
              </>
            ) : (
              'Save Changes'
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

export default EditKnowledgeBaseModal; 