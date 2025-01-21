import { Customer } from '../../types';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
}

const CustomerList = ({ customers, selectedCustomerId, onSelectCustomer }: CustomerListProps) => {
  return (
    <div className="w-56 border-r border-base-200 flex flex-col bg-base-100 rounded-tl-box rounded-bl-box">
      <div className="p-4 border-b border-base-200">
        <h2 className="text-lg font-bold">Inbox</h2>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {customers.map((customer) => (
          <button
            key={customer.id}
            onClick={() => onSelectCustomer(customer.id)}
            className={`w-full px-3 py-2 text-left rounded-lg text-sm transition-colors ${
              selectedCustomerId === customer.id 
                ? "bg-base-200" 
                : "hover:bg-base-200/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="font-medium truncate">{customer.full_name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerList; 