import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import supabase from './supabase';
import { User, Conversation, Message, Customer, CreateMessagePayload } from './types';

interface SessionState {
  isLoading: boolean;
  session: User | null;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
}

interface UserState {
  users: User[];
  fetchUsers: () => Promise<void>;
}

interface CustomerState {
  customers: Customer[];
  fetchCustomers: () => Promise<void>;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (customerId: string | null) => void;
  addCustomer: (customer: Customer) => void;
}

interface ConversationState {
  conversations: Conversation[];
  fetchConversations: () => Promise<void>;
  fetchConversationById: (conversationId: string) => Promise<void>;
  selectedConversationId: string | null;
  setSelectedConversationId: (conversationId: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversationStatus: (conversationId: string, status: string) => Promise<void>;
}

interface MessageState {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  fetchMessagesByConversationId: (conversationId: string) => Promise<Message[]>;
  createMessage: (message: CreateMessagePayload) => Promise<void>;
  addMessage: (message: Message) => void;
}

interface TagsState {
  tags: Tag[];
  fetchTags: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  isLoading: true,
  session: null,
  fetchSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session?.user.id)
        .single();

      if (error || userError) {
        throw new Error('Failed to fetch session');
      }
      set({ session: userData });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      set({ session: null });
      window.location.href = '/login';
    }
  },
}));

export const useUserStore = create<UserState>((set) => ({
  users: [],
  fetchUsers: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error(error);
    } else {
      set({ users: data || [] });
    }
  },
}));

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  fetchCustomers: async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', 'b6a0fc05-e31c-4b0d-a987-345c8b6e05ad');
    if (error) {
      console.error(error);
    } else {
      set({ customers: data || [] });
    }
  },
  selectedCustomerId: null,
  setSelectedCustomerId: (customerId) => set({ selectedCustomerId: customerId }),
  addCustomer: (customer: Customer) => 
    set(state => ({
      customers: [...state.customers, customer]
    })),
}));

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  fetchConversations: async () => {
    const { data, error } = await supabase.from('conversations').select('*, tags(*)').eq('org_id', 'b6a0fc05-e31c-4b0d-a987-345c8b6e05ad');
    if (error) {
      console.error(error);
    } else {
      set({ conversations: data || [] });
    }
  },
  fetchConversationById: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    if (error) {
      console.error(error);
    } else {
      set({ selectedConversation: data });
    }
  },
  selectedConversationId: null,
  setSelectedConversationId: (conversationId) => set({ selectedConversationId: conversationId }),
  addConversation: (conversation: Conversation) => 
    set(state => ({
      conversations: [...state.conversations, conversation]
    })),
  updateConversationStatus: async (conversationId: string, status: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', conversationId);
    
    if (error) {
      console.error(error);
      toast.error('Failed to update conversation status');
    } else {
      set(state => ({
        conversations: state.conversations.map(conv => 
          conv.id === conversationId ? { ...conv, status } : conv
        ),
        selectedConversation: state.selectedConversation?.id === conversationId 
          ? { ...state.selectedConversation, status }
          : state.selectedConversation
      }));
      toast.success(`Conversation ${status}`);
    }
  },
}));

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  fetchMessages: async () => {
    const { data, error } = await supabase.from('messages').select('*');
    if (error) {
      console.error(error);
      toast.error('Failed to fetch messages');
    } else {
      set({ messages: data || [] });
    }
  },
  fetchMessagesByConversationId: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId);
    if (error) {
      console.error(error);
      toast.error('Failed to fetch messages');
      return [];
    } else {
      set({ messages: [...get().messages, ...data] });
      return data;
    }
  },
  createMessage: async (message: CreateMessagePayload) => {
    const { data, error } = await supabase.from('messages').insert(message);
    if (error) {
      console.error(error);
      toast.error('Failed to create message');
    }
  },
  addMessage: (message: Message) => 
    set(state => ({
      messages: [...state.messages, message]
    })),
}));  

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  fetchTags: async () => {
    const { data, error } = await supabase.from('tags').select('*');
    if (error) {
      console.error(error);
    } else {
      set({ tags: data || [] });
    }
  },
}));