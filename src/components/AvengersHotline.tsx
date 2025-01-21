import { useState } from 'react';
import { XMarkIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';
import { useSessionStore } from '../store';
import classNames from 'classnames';
import avengersLogo from '../assets/avengers-logo.png';

const AvengersHotline = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { session } = useSessionStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-blue-700">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-white">
          <img 
            src={avengersLogo} 
            alt="Avengers Logo" 
            className="h-32 w-auto mx-auto mb-8 drop-shadow-lg"
          />
          <h1 className="text-5xl font-bold mb-4">Avengers Hotline</h1>
          <p className="text-xl mb-8">
            Need help? The Earth's Mightiest Heroes are just a message away.
          </p>
          <div className="max-w-2xl mx-auto space-y-6 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-semibold">When should you contact us?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Alien invasions or interdimensional threats</li>
              <li>Supernatural or mystical disturbances</li>
              <li>Super-villain activities</li>
              <li>Global or cosmic level emergencies</li>
              <li>Any situation requiring superhuman intervention</li>
            </ul>
            <p className="text-sm opacity-75">
              For immediate local emergencies, please contact your regular emergency services first.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen ? (
          <div className="bg-base-100 rounded-lg shadow-xl w-96 h-[32rem] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-base-200 flex items-center justify-between bg-primary text-primary-content rounded-t-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={avengersLogo} 
                  alt="Avengers Logo" 
                  className="h-8 w-auto"
                />
                <div>
                  <h3 className="font-bold">Avengers Support</h3>
                  <p className="text-sm opacity-90">We usually respond in a few minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-neutral">
                  Hello! How can the Avengers help you today?
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-base-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your situation..."
                  className="input input-bordered flex-1"
                />
                <button 
                  className="btn btn-primary"
                  disabled={!message.trim()}
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-base-content/70 mt-2">
                Press Enter to send
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className={classNames(
              "btn btn-circle btn-lg shadow-lg",
              "bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-700 hover:to-blue-800",
              "text-white border-none"
            )}
          >
            <img 
              src={avengersLogo} 
              alt="Avengers Logo" 
              className="h-6 w-auto filter brightness-0 invert"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default AvengersHotline;
