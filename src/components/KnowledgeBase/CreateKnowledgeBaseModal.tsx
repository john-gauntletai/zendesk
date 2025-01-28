import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { useSessionStore } from "../../store";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-hot-toast";

interface CreateKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#0ea5e9", // sky-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
];

const CreateKnowledgeBaseModal = ({ isOpen, onClose }: CreateKnowledgeBaseModalProps) => {
  const { createKnowledgeBase } = useKnowledgeBaseStore();
  const { session } = useSessionStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [themeColor, setThemeColor] = useState(PRESET_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsSubmitting(true);
    try {
      await createKnowledgeBase({
        name: name.trim(),
        description: description.trim(),
        logo_url: logoUrl.trim(),
        theme_color: themeColor,
        org_id: session!.org_id,
      });
      
      toast.success("Knowledge base created successfully");
      onClose();
      setName("");
      setDescription("");
      setLogoUrl("");
      setThemeColor(PRESET_COLORS[0]);
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      toast.error("Failed to create knowledge base");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-6">Create Knowledge Base</h3>
        
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
              placeholder="Enter description"
              className="textarea textarea-bordered w-full"
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
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    themeColor === color ? "border-base-content" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setThemeColor(color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
              <button
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-base-200 ${
                  showColorPicker ? "border-base-content" : "border-transparent"
                }`}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span className="text-xs">+</span>
              </button>
            </div>
            {showColorPicker && (
              <div className="mt-2">
                <HexColorPicker color={themeColor} onChange={setThemeColor} />
              </div>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={() => {
              onClose();
              setName("");
              setDescription("");
              setLogoUrl("");
              setThemeColor(PRESET_COLORS[0]);
              setShowColorPicker(false);
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
              'Create Knowledge Base'
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

export default CreateKnowledgeBaseModal; 