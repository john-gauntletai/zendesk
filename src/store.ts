import { create } from "zustand";
import { toast } from "react-hot-toast";
import supabase from "./supabase";
import {
  User,
  Conversation,
  Message,
  Customer,
  CreateMessagePayload,
  Tag,
  Role,
} from "./types";

interface SessionState {
  isLoading: boolean;
  session: User | null;
  fetchSession: () => Promise<void>;
  logout: () => Promise<void>;
}

interface UserState {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

interface CustomerState {
  customers: Customer[];
  fetchCustomers: (orgId: string) => Promise<void>;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
}

interface ConversationState {
  conversations: Conversation[];
  fetchConversations: () => Promise<void>;
  fetchConversationById: (conversationId: string) => Promise<void>;
  selectedConversationId: string | null;
  setSelectedConversationId: (conversationId: string | null) => void;
  receiveConversationUpdate: (updatedConversation: Conversation) => void;
  updateConversation: (conversation: Conversation) => void;
  updateConversationStatus: (
    conversationId: string,
    status: string
  ) => Promise<void>;
}

interface MessageState {
  messages: Message[];
  fetchMessages: () => Promise<void>;
  fetchMessagesByConversationId: (conversationId: string) => Promise<Message[]>;
  createMessage: (message: CreateMessagePayload) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
}

interface TagsState {
  tags: Tag[];
  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => void;
  updateTag: (tag: Tag) => void;
  removeTag: (tagId: string) => void;
}

interface RolesState {
  roles: Role[];
  fetchRoles: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  isLoading: true,
  session: null,
  fetchSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.session?.user.id)
        .single();

      if (error || userError) {
        throw new Error("Failed to fetch session");
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
      window.location.href = "/login";
    }
  },
}));

export const useUserStore = create<UserState>((set) => ({
  users: [],
  fetchUsers: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error(error);
    } else {
      set({ users: data || [] });
    }
  },
  addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user: User) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
}));

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  fetchCustomers: async (orgId: string) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
    } else {
      set({ customers: data || [] });
    }
  },
  addCustomer: (customer: Customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
    })),
  updateCustomer: (customer: Customer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customer.id ? customer : c
      ),
    })),
}));

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  fetchConversations: async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*, tags(*)");
    if (error) {
      console.error(error);
    } else {
      set({ conversations: data || [] });
    }
  },
  fetchConversationById: async (conversationId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*, tags(*)")
      .eq("id", conversationId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    set((state) => {
      const existingIndex = state.conversations.findIndex(
        (conv) => conv.id === conversationId
      );

      if (existingIndex === -1) {
        // Conversation doesn't exist, add it to the array
        return {
          conversations: [...state.conversations, data],
        };
      } else {
        // Conversation exists, replace it
        const updatedConversations = [...state.conversations];
        updatedConversations[existingIndex] = data;
        return {
          conversations: updatedConversations,
        };
      }
    });
  },
  selectedConversationId: null,
  setSelectedConversationId: (conversationId) =>
    set({ selectedConversationId: conversationId }),
  receiveConversationUpdate: (updatedConversation: Conversation) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === updatedConversation.id 
          ? { ...conv, ...updatedConversation }
          : conv
      ),
    })),
  updateConversation: async (
    conversationId: string,
    payload: Partial<Conversation>
  ) => {
    const { data, error } = await supabase
      .from("conversations")
      .update(payload)
      .eq("id", conversationId)
      .select("*, tags(*)");

    if (error) {
      console.error(error);
      toast.error("Failed to update conversation");
      return;
    }

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, ...payload } : conv
      ),
    }));
  },
  addTagToConversation: async (conversationId: string, tagId: string) => {
    const { data, error } = await supabase.from("conversations_tags").insert({
      conversation_id: conversationId,
      tag_id: tagId,
    });
    if (error) {
      console.error(error);
      toast.error("Failed to add tag to conversation");
    }
  },
  removeTagFromConversation: async (conversationId: string, tagId: string) => {
    const { data, error } = await supabase
      .from("conversations_tags")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("tag_id", tagId);
    console.log("data", data);
    if (error) {
      console.error(error);
      toast.error("Failed to remove tag from conversation");
    }
  },
}));

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  fetchMessages: async () => {
    const { data, error } = await supabase.from("messages").select("*");
    if (error) {
      console.error(error);
      toast.error("Failed to fetch messages");
    } else {
      set({ messages: data || [] });
    }
  },
  fetchMessagesByConversationId: async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch messages");
      return [];
    } else {
      set({ messages: [...get().messages, ...data] });
      return data;
    }
  },
  createMessage: async (message: CreateMessagePayload) => {
    const { data, error } = await supabase.from("messages").insert(message);
    if (error) {
      console.error(error);
      toast.error("Failed to create message");
    }
  },
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateMessage: (message: Message) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === message.id ? message : msg
      ),
    })),
}));

export const useTagsStore = create<TagsState>((set) => ({
  tags: [],
  fetchTags: async () => {
    const { data, error } = await supabase.from("tags").select("*");
    if (error) {
      console.error(error);
    } else {
      set({ tags: data || [] });
    }
  },
  addTag: (tag: Tag) =>
    set((state) => ({
      tags: [...state.tags, tag],
    })),
  updateTag: (tag: Tag) =>
    set((state) => ({
      tags: state.tags.map((t) => (t.id === tag.id ? tag : t)),
    })),
  removeTag: (tagId: string) =>
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== tagId),
    })),
}));

export const useRolesStore = create<RolesState>((set) => ({
  roles: [],
  fetchRoles: async () => {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) {
      console.error(error);
    } else {
      set({ roles: data || [] });
    }
  },
}));
