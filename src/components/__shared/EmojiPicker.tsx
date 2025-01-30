import { useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Portal from './Portal';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  triggerButton: React.ReactNode;
}

const EmojiPicker = ({ onSelect, triggerButton }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        {triggerButton}
      </div>

      {isOpen && (
        <Portal>
          <div 
            className="fixed inset-0 z-50" 
            onClick={() => setIsOpen(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
              }}
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  onSelect(emoji.native);
                  setIsOpen(false);
                }}
                theme="light"
              />
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default EmojiPicker; 