import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const MessageInput = ({ value, onChange, onSubmit }: MessageInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div 
      className="flex-shrink-0 flex gap-2 p-2 border-t border-base-300 bg-base-100 sticky bottom-0" 
      style={{ boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)' }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="textarea textarea-bordered flex-1 resize-none"
        rows={2}
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="btn btn-primary h-10 min-h-0"
      >
        <PaperAirplaneIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MessageInput; 