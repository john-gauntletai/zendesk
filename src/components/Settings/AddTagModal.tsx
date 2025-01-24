import { useState } from "react";

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tag: {
    name: string;
    background_color: string;
    text_color: string;
  }) => void;
}

const PRESET_COLORS = [
  { bg: '#E5F6FD', text: '#0369A1' }, // Light blue
  { bg: '#ECF8F6', text: '#065F46' }, // Light green
  { bg: '#FEF3C7', text: '#92400E' }, // Light yellow
  { bg: '#FEE2E2', text: '#991B1B' }, // Light red
  { bg: '#F3E8FF', text: '#6B21A8' }, // Light purple
  { bg: '#E0E7FF', text: '#3730A3' }, // Light indigo
  { bg: '#FFF1F2', text: '#9F1239' }, // Light pink
  { bg: '#F1F5F9', text: '#334155' }, // Light slate
  { bg: '#F0FDF4', text: '#166534' }, // Mint green
  { bg: '#FDF4FF', text: '#86198F' }, // Magenta
  { bg: '#FFF7ED', text: '#9A3412' }, // Orange
  { bg: '#EFF6FF', text: '#1E40AF' }, // Royal blue
  { bg: '#FFFBEB', text: '#854D0E' }, // Amber
];

const AddTagModal = ({ isOpen, onClose, onSubmit }: AddTagModalProps) => {
  const [tagName, setTagName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomColors = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    onSubmit({
      name: tagName,
      background_color: randomColors.bg,
      text_color: randomColors.text,
    });
    setTagName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Create New Tag</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tag Name</span>
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="input input-bordered"
              placeholder="Enter tag name"
              required
              maxLength={30}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Maximum 30 characters
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!tagName.trim()}
            >
              Create Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTagModal; 