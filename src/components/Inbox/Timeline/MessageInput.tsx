import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const MessageInput = ({ value, onChange, onSubmit }: MessageInputProps) => {
  return (
    <div className="flex items-center gap-2 p-2 border-t border-base-300 relative" 
      style={{ boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)' }}
    >
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your message..."
        className="input input-bordered flex-1 h-10"
      />
      <button
        onClick={onSubmit}
        className="btn btn-primary h-10 min-h-0"
      >
        <PaperAirplaneIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MessageInput; 