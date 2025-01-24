import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emails: string[]) => Promise<void>;
}

const InviteTeammatesModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [emails, setEmails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean and parse emails
      const cleanedEmails = emails
        .replace(/\s/g, "") // Remove all whitespace
        .split(",")
        .filter(email => email.trim() !== ""); // Remove empty entries

      await onSubmit(cleanedEmails);
      setEmails("");
      onClose();
    } catch (error) {
      console.error("Error inviting teammates:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Invite Teammates</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Addresses</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Enter email addresses separated by commas"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                Example: john@example.com, jane@example.com
              </span>
            </label>
          </div>
          
          <div className="modal-action">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={onClose}
              disabled={isSubmitting}
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
                  <span className="loading loading-spinner"></span>
                  Inviting...
                </>
              ) : (
                'Invite'
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

export default InviteTeammatesModal; 