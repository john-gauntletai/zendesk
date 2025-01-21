import { useState } from 'react';
import classNames from 'classnames';
import { Message, CreateMessagePayload, Conversation } from '../../types';
import { 
  PaperAirplaneIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import { useMessageStore, useSessionStore, useConversationStore } from '../../store';
import { format, isToday, isYesterday, isSameDay, differenceInMinutes } from 'date-fns';

interface MessageGroup {
  date: Date;
  messages: Message[];
}

interface MessagesPanelProps {
  messages: Message[];
  selectedConversation: Conversation | null;
}

const MessagesPanel = ({ messages, selectedConversation }: MessagesPanelProps) => {
  const [messageInput, setMessageInput] = useState('');
  const { session } = useSessionStore();
  const { createMessage } = useMessageStore();
  const { updateConversationStatus } = useConversationStore();

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const firstMessage = sortedMessages[0]?.content || 'No messages';

  // Group messages by day and then by 5-minute intervals
  const groupedMessages = sortedMessages.reduce((groups: MessageGroup[], message) => {
    const messageDate = new Date(message.created_at);
    const messageDay = new Date(messageDate.setHours(0, 0, 0, 0));

    let group = groups.find(g => isSameDay(g.date, messageDay));
    if (!group) {
      group = { date: messageDay, messages: [] };
      groups.push(group);
    }

    group.messages.push(message);
    return groups;
  }, []);

  const shouldShowTimestamp = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    if (previousMessage.sender_type !== currentMessage.sender_type) return true;
    
    const currentDate = new Date(currentMessage.created_at);
    const previousDate = new Date(previousMessage.created_at);
    return Math.abs(differenceInMinutes(currentDate, previousDate)) > 5;
  };

  const formatDayDivider = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation?.id || !session) return;

    const newMessage: CreateMessagePayload = {
      conversation_id: selectedConversation?.id,
      content: messageInput.trim(),
      attachments: null,
      sender_id: session.id,
      sender_type: 'user'
    };

    await createMessage(newMessage);
    setMessageInput('');
  };

  const handleStatusChange = async () => {
    if (!selectedConversation) return;
    const newStatus = selectedConversation.status === 'closed' ? 'open' : 'closed';
    await updateConversationStatus(selectedConversation.id, newStatus);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-grow flex flex-[2] flex-col border-r border-base-200 bg-base-100 rounded-box mr-1 min-w-48">
      <div className="p-4 border-b border-base-200 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-lg font-bold truncate">
            {firstMessage}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleStatusChange}
            className="btn btn-sm btn-ghost btn-square"
            title={selectedConversation?.status === 'closed' ? 'Reopen conversation' : 'Close conversation'}
          >
            {selectedConversation?.status === 'closed' ? (
              <ArrowPathIcon className="w-5 h-5" />
            ) : (
              <XCircleIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {selectedConversation?.status && (
        <div className="px-4 py-2 border-b border-base-200 bg-base-200/50">
          <div className="text-sm text-base-content/70">
            Status: {' '}
            <span className={classNames(
              'badge badge-sm',
              {
                'badge-info': selectedConversation.status === 'new',
                'badge-success': selectedConversation.status === 'open',
                'badge-neutral': selectedConversation.status === 'closed'
              }
            )}>
              {selectedConversation.status.charAt(0).toUpperCase() + selectedConversation.status.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {selectedConversation ? (
          <div className="space-y-6">
            {groupedMessages.map((group) => (
              <div key={group.date.toISOString()}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs text-base-content/70 bg-base-100">
                      {formatDayDivider(group.date)}
                    </span>
                  </div>
                </div>

                {group.messages.map((message, index) => {
                  const showTimestamp = shouldShowTimestamp(message, group.messages[index - 1]);
                  const isSameSenderAsPrevious = index > 0 && 
                    message.sender_type === group.messages[index - 1].sender_type;
                  const isSameSenderAsNext = index < group.messages.length - 1 && 
                    message.sender_type === group.messages[index + 1].sender_type;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={classNames(
                        'chat',
                        message.sender_type === 'user' ? 'chat-end' : 'chat-start',
                        'mt-0',
                        {
                          'mb-0': !showTimestamp && isSameSenderAsNext
                        }
                      )}
                    >
                      <div className={classNames(
                        'chat-bubble mt-0',
                        message.sender_type === 'user' 
                          ? 'chat-bubble-primary' 
                          : 'chat-bubble-neutral'
                      )}>
                        {message.content}
                      </div>
                      {showTimestamp && (
                        <div className="chat-footer opacity-50 text-xs mt-1">
                          {message.sender_type === 'user' ? "You" : "Customer"} • {
                            format(new Date(message.created_at), 'h:mm a')
                          }
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-base-content/70">
            Select a conversation to view messages
          </div>
        )}
      </div>

      {selectedConversation && (
        <div className="p-4 border-t border-base-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 input input-bordered"
            />
            <button 
              className="btn btn-primary btn-square"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPanel; 