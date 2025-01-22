import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import avengersLogo from '../../assets/avengers-logo.png';
import { Customer, Message } from '../../types';
import supabase from '../../supabase';
import { toast } from 'react-hot-toast';

interface UserInfo {
  email: string;
  fullName: string;
}

interface ChatWidgetProps {
  userInfo: UserInfo | null;
  onUserInfoSubmit: (userInfo: UserInfo) => Promise<void>;
  customer: Customer | null;
}

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

interface ConversationListProps {
  customer: Customer;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onBack: () => void;
  placeholder?: string;
}

const UserInfoForm = ({ onSubmit }: UserInfoFormProps) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email.trim() || !fullName.trim()) {
      setIsSubmitting(false);
      return;
    }

    const userInfo = { email: email.trim(), fullName: fullName.trim() };
    onSubmit(userInfo);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg mb-2">Before we begin</h3>
        <p className="text-sm text-base-content/70">
          Please provide your contact information so we can reach you if needed.
        </p>
      </div>
      <div className="space-y-4 flex-1">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>
      <button 
        type="submit"
        className={classNames(
          "btn btn-primary w-full",
          isSubmitting && "loading"
        )}
        disabled={isSubmitting || !email.trim() || !fullName.trim()}
      >
        Continue to Chat
      </button>
    </form>
  );
};

const ConversationList = ({ customer, onSelectConversation, onNewConversation }: ConversationListProps) => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 overflow-y-auto p-4">
      {!customer.conversations?.length ? (
        <div className="text-center py-8">
          <div className="text-base-content/70 mb-6">
            <p className="font-medium mb-2">No conversations yet</p>
            <p className="text-sm">
              Start a new conversation and we'll connect you with an available Avenger.
            </p>
          </div>
          <button 
            onClick={onNewConversation}
            className="btn btn-primary"
          >
            Start New Conversation
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {customer.conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[conversation.messages.length - 1];
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className="w-full p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Case #{conversation.id.slice(-4)}</span>
                  <span className={classNames(
                    "badge badge-sm",
                    {
                      'badge-info': conversation.status === 'new',
                      'badge-success': conversation.status === 'open',
                      'badge-neutral': conversation.status === 'closed'
                    }
                  )}>
                    {conversation.status}
                  </span>
                </div>
                {lastMessage && (
                  <p className="text-sm text-base-content/70 truncate">
                    {lastMessage.content}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
    {customer.conversations?.length > 0 && (
      <div className="p-4 border-t border-base-200">
        <button 
          onClick={onNewConversation}
          className="btn btn-primary w-full"
        >
          New Conversation
        </button>
      </div>
    )}
  </div>
);

const ChatInterface = ({ messages, onSendMessage, onBack, placeholder }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-neutral">
            {placeholder || "How can the Avengers help you today?"}
          </div>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={classNames(
              'chat',
              msg.sender_type === 'user' ? 'chat-start' : 'chat-end'
            )}
          >
            <div className={classNames(
              'chat-bubble',
              msg.sender_type === 'user' ? 'chat-bubble-neutral' : 'chat-bubble-primary'
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-base-200">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-square"
            title="Back to conversations"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your situation..."
            className="input input-bordered flex-1"
          />
          <button 
            className={classNames(
              "btn btn-primary",
              isSending && "loading"
            )}
            onClick={handleSend}
            disabled={!message.trim() || isSending}
          >
            Send
          </button>
        </div>
        <p className="text-xs text-base-content/70 mt-2">
          Press Enter to send
        </p>
      </div>
    </>
  );
};

const ChatWidget = ({ userInfo, onUserInfoSubmit, customer }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedConversationId) {
      const conversation = customer?.conversations?.find(c => c.id === selectedConversationId);
      setMessages(conversation?.messages || []);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, customer]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setIsNewConversation(true);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
    setIsNewConversation(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!customer) return;

    let conversationId = selectedConversationId;

    // Create new conversation if needed
    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          customer_id: customer.id,
          org_id: customer.org_id,
          status: 'new',
          channel: 'web'
        })
        .select()
        .single();

      if (convError || !newConversation) {
        throw new Error('Failed to create conversation');
      }

      conversationId = newConversation.id;
      setSelectedConversationId(conversationId);
    }

    // Create message
    const { data: newMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender_id: customer.id,
        sender_type: 'customer',
        attachments: null
      })
      .select()
      .single();

    if (msgError || !newMessage) {
      throw new Error('Failed to send message');
    }

    setMessages(prev => [...prev, newMessage]);
    setIsNewConversation(false);
  };

  const renderContent = () => {
    if (!userInfo) {
      return <UserInfoForm onSubmit={onUserInfoSubmit} />;
    }

    if (!customer) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="loading loading-spinner loading-lg" />
        </div>
      );
    }

    if (selectedConversationId || isNewConversation) {
      return (
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={handleBackToList}
          placeholder={isNewConversation ? 
            "Please describe your situation and we'll connect you with an available Avenger." :
            "Continuing your previous conversation..."
          }
        />
      );
    }

    return (
      <ConversationList 
        customer={customer}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
    );
  };

  return (
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

          {renderContent()}
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
  );
};

export default ChatWidget; 