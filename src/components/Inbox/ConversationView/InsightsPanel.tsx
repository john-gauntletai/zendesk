import { useCustomerStore, useConversationStore, useUserStore } from "../../../store";
import Avatar from "../../__shared/Avatar";
import TagList from "../../__shared/TagList";
import ConversationStatusBadge from "../../__shared/ConversationStatusBadge";

const InsightsPanel = () => {
  const { customers } = useCustomerStore();
  const { selectedConversationId, conversations } = useConversationStore();
  const { users } = useUserStore();

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const customer = customers.find((c) => c.id === selectedConversation?.customer_id);
  const assignedUser = users.find(u => u.id === selectedConversation?.assigned_to);

  if (!selectedConversation) return null;

  return (
    <div className="w-80 border-l-2 border-base-300 bg-base-100 p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="font-medium mb-2">Customer</h3>
          <div className="flex items-center gap-2">
            <Avatar user={customer} size={32} />
            <div>
              <div className="font-medium">{customer?.full_name || "Unknown"}</div>
              <div className="text-sm text-base-content/70">
                {customer?.email || "No email"}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <h3 className="font-medium mb-2">Assigned To</h3>
          {assignedUser ? (
            <div className="flex items-center gap-2">
              <Avatar user={assignedUser} size={32} />
              <div>
                <div className="font-medium">{assignedUser.full_name}</div>
                <div className="text-sm text-base-content/70">{assignedUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-base-content/70">Not assigned</div>
          )}
        </div>

        {/* Status */}
        <div>
          <h3 className="font-medium mb-2">Status</h3>
          <ConversationStatusBadge conversation={selectedConversation} />
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-medium mb-2">Tags</h3>
          <TagList conversation={selectedConversation} showAddButton />
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
