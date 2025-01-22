import { useState, useEffect } from 'react';
import classNames from 'classnames';
import supabase from '../../supabase';
import { Customer } from '../../types';
import avengersLogo from '../../assets/avengers-logo.png';
import ChatWidget from './ChatWidget';

interface UserInfo {
  email: string;
  fullName: string;
}

const AvengersHotline = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('avengers_user_info');
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      const fetchCustomer = async () => {
        const { data: customer, error } = await supabase
          .from('customers')
          .select(`
            *,
            conversations(
              *,
              messages(*)
            )
          `)
          .eq('email', userInfo.email)
          .eq('org_id', 'b6a0fc05-e31c-4b0d-a987-345c8b6e05ad')
          .single();

        if (!error && customer) {
          setCustomer(customer);
        }
      };
      fetchCustomer();
    }
  }, [userInfo]);

  useEffect(() => {
    if (customer) {
      // Subscribe to new messages for all conversations
      const messagesSubscription = supabase
        .channel('customer-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=in.(${customer.conversations?.map(conv => conv.id).join(',') || ''})`
          },
          async (payload) => {
            const newMessage = payload.new;
            
            // Update the customer state with the new message
            setCustomer(prevCustomer => {
              if (!prevCustomer) return null;
              
              return {
                ...prevCustomer,
                conversations: prevCustomer.conversations?.map(conv => {
                  if (conv.id === newMessage.conversation_id) {
                    return {
                      ...conv,
                      messages: [...(conv.messages || []), newMessage]
                    };
                  }
                  return conv;
                })
              };
            });
          }
        )
        .subscribe();

      // Subscribe to new conversations for this customer
      const conversationsSubscription = supabase
        .channel('customer-conversations')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversations',
            filter: `customer_id=eq.${customer.id}`
          },
          async (payload) => {
            const newConversation = payload.new;
            
            // Fetch messages for the new conversation
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', newConversation.id);
            
            // Update customer state with new conversation
            setCustomer(prevCustomer => {
              if (!prevCustomer) return null;
              
              return {
                ...prevCustomer,
                conversations: [
                  ...(prevCustomer.conversations || []),
                  { ...newConversation, messages: messages || [] }
                ]
              };
            });
          }
        )
        .subscribe();

      // Cleanup subscriptions
      return () => {
        messagesSubscription.unsubscribe();
        conversationsSubscription.unsubscribe();
      };
    }
  }, [customer]);

  const handleUserInfoSubmit = async (newUserInfo: UserInfo) => {
    localStorage.setItem('avengers_user_info', JSON.stringify(newUserInfo));
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .upsert({
        email: newUserInfo.email,
        full_name: newUserInfo.fullName,
        org_id: 'b6a0fc05-e31c-4b0d-a987-345c8b6e05ad'
      })
      .select()
      .single();

    if (!error && newCustomer) {
      setCustomer(newCustomer);
    }
    setUserInfo(newUserInfo);

    if (error) {
      console.error('Error creating customer:', error);
      return;
    }
  };

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

      <ChatWidget 
        userInfo={userInfo}
        onUserInfoSubmit={handleUserInfoSubmit}
        customer={customer}
      />
    </div>
  );
};

export default AvengersHotline;
