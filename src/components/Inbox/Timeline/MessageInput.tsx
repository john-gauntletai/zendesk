import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const MessageInput = ({ value, onChange, onSubmit }: MessageInputProps) => {
  return (
    <div className="flex items-center gap-2 pt-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your message..."
        className="input input-bordered input-sm flex-1"
      />
      <button
        onClick={onSubmit}
        className="btn btn-primary btn-sm"
      >
        <PaperAirplaneIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MessageInput; 