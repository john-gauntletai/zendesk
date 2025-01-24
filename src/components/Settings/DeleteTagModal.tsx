import { Tag } from "../../types";

interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tagId: string) => void;
  tag: Tag;
}

const DeleteTagModal = ({ isOpen, onClose, onConfirm, tag }: DeleteTagModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Delete Tag</h3>
        <p>
          Are you sure you want to delete the tag{" "}
          <span 
            className="px-2 py-1 rounded text-sm inline-block"
            style={{
              backgroundColor: tag.background_color,
              color: tag.text_color,
            }}
          >
            {tag.name}
          </span>
          ? This action cannot be undone.
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
            onClick={() => onConfirm(tag.id)}
          >
            Delete Tag
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTagModal; 