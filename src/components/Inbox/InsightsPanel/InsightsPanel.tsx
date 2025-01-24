import { useCustomerStore, useConversationStore } from "../../../store";
import Avatar from "../../__shared/Avatar";

const InsightsPanel = () => {
  const { customers } = useCustomerStore();
  const { selectedConversationId, conversations } = useConversationStore();

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const customer = selectedConversation
    ? customers.find((c) => c.id === selectedConversation.customer_id)
    : null;

  if (!selectedConversation || !customer) {
    return (
      <div className="w-80 border-l-2 border-base-300 bg-base-100 p-4">
        <div className="text-sm text-base-content/60 text-center">
          Select a conversation to view insights
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l-2 border-base-300 bg-base-100 flex-shrink-0">
      {/* Customer Section */}
      <div className="p-4 border-b border-base-300">
        <h3 className="text-sm font-medium mb-4">Customer</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <Avatar user={customer} size={40} />
          <div>
            <div className="font-medium">{customer.full_name}</div>
            <div className="text-sm text-base-content/60">{customer.email}</div>
          </div>
        </div>

        {/* Customer Attributes */}
        <div className="space-y-2">
          {customer.phone && (
            <div className="text-sm">
              <span className="text-base-content/60">Phone:</span>{" "}
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.company && (
            <div className="text-sm">
              <span className="text-base-content/60">Company:</span>{" "}
              <span>{customer.company}</span>
            </div>
          )}
          {customer.created_at && (
            <div className="text-sm">
              <span className="text-base-content/60">Customer since:</span>{" "}
              <span>
                {new Date(customer.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Attributes Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-4">Conversation</h3>
        
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-base-content/60">Channel:</span>{" "}
            <span className="capitalize">{selectedConversation.channel}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-base-content/60">Status:</span>{" "}
            <span className={`capitalize ${
              selectedConversation.status === 'open' 
                ? 'text-error' 
                : 'text-success'
            }`}>
              {selectedConversation.status}
            </span>
          </div>

          <div className="text-sm">
            <span className="text-base-content/60">Created:</span>{" "}
            <span>
              {new Date(selectedConversation.created_at).toLocaleDateString()}
            </span>
          </div>

          {selectedConversation.assigned_to && (
            <div className="text-sm">
              <span className="text-base-content/60">Assigned to:</span>{" "}
              <span>{selectedConversation.assigned_to}</span>
            </div>
          )}

          {selectedConversation.tags && selectedConversation.tags.length > 0 && (
            <div className="text-sm">
              <div className="text-base-content/60 mb-1">Tags:</div>
              <div className="flex flex-wrap gap-1">
                {selectedConversation.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-base-200 text-base-content/70 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
