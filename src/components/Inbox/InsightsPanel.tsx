import { UserIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { Customer, Conversation } from '../../types';

interface InsightsPanelProps {
  selectedCustomer: Customer | null;
  selectedConversation: Conversation | null;
}

const InsightsPanel = ({ selectedCustomer, selectedConversation }: InsightsPanelProps) => {
  return (
    <div className="max-w-96 flex-[1] flex-col max-w-md bg-base-100 rounded-box">
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-bold">Insights</h2>
      </div>
      {selectedCustomer ? (
        <div className="p-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">
                <UserIcon className="w-5 h-5" />
                Customer Details
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-base-content/70">
                    Full Name
                  </div>
                  <div>{selectedCustomer.full_name}</div>
                </div>
                <div>
                  <div className="text-sm text-base-content/70">Email</div>
                  <div>{selectedCustomer.email}</div>
                </div>
              </div>
            </div>
          </div>

          {selectedConversation && (
            <div className="card bg-base-200 mt-4">
              <div className="card-body">
                <h3 className="card-title">
                  <ChartBarIcon className="w-5 h-5" />
                  Conversation Stats
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-base-content/70">
                      Messages
                    </div>
                    <div>24 messages</div>
                  </div>
                  <div>
                    <div className="text-sm text-base-content/70">
                      Duration
                    </div>
                    <div>2 days</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-base-content/70">
          Select a customer to view insights
        </div>
      )}
    </div>
  );
};

export default InsightsPanel; 