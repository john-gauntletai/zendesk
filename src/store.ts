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
  Team,
  KnowledgeBase,
  Category,
  Article,
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

interface TeamsState {
  teams: Team[];
  fetchTeams: () => Promise<void>;
  createTeam: (team: Team) => Promise<void>;
  updateTeam: (team: Team) => Promise<void>;
  removeTeam: (teamId: string) => Promise<void>;
  fetchTeamById: (teamId: string) => Promise<void>;
  addUserToTeam: (teamId: string, userId: string) => Promise<void>;
  removeUserFromTeam: (teamId: string, userId: string) => Promise<void>;
}

interface KnowledgeBaseState {
  knowledgeBases: KnowledgeBase[];
  categories: Category[];
  articles: Article[];
  generationStatus: any;
  generatingKbId: string | null;
  generateCategoriesAndArticles: (kbId: string, {brandVoiceExample, additionalNotes}: {brandVoiceExample: string, additionalNotes: string}) => Promise<void>;
  fetchKnowledgeBases: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchArticles: () => Promise<void>;
  createKnowledgeBase: (kb: KnowledgeBase) => Promise<void>;
  updateKnowledgeBase: (kb: KnowledgeBase) => Promise<void>;
  addKnowledgeBase: (kb: KnowledgeBase) => void;
  receiveKnowledgeBaseUpdate: (kb: KnowledgeBase) => void;
  removeKnowledgeBase: (id: string) => void;
  createCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  addCategory: (category: Category) => void;
  receiveCategoryUpdate: (category: Category) => void;
  removeCategory: (id: string) => void;
  createArticle: (article: Article) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  addArticle: (article: Article) => void;
  receiveArticleUpdate: (article: Article) => void;
  removeArticle: (id: string) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  fetchKnowledgeBaseById: (kbId: string) => Promise<KnowledgeBase | null>;
  fetchCategoriesByKnowledgeBaseId: (kbId: string) => Promise<Category[]>;
  fetchArticlesByKnowledgeBaseId: (kbId: string) => Promise<Article[]>;
  deleteKnowledgeBase: (kbId: string) => Promise<void>;
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
      set({ isLoading: false, session: userData });
    } catch (error) {
      console.error(error);
      set({ isLoading: false, session: null });
    }
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      set({ session: null });
      window.location.href = "/";
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
  fetchConversations: async (orgId: string) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*, tags(*)")
      .eq("org_id", orgId);
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
    } else {
      useConversationStore.getState().fetchConversationById(conversationId);
    }
  },
  removeTagFromConversation: async (conversationId: string, tagId: string) => {
    const { data, error } = await supabase
      .from("conversations_tags")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("tag_id", tagId);
    if (error) {
      console.error(error);
      toast.error("Failed to remove tag from conversation");
    } else {
      useConversationStore.getState().fetchConversationById(conversationId);
    }
  },
}));

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  fetchMessages: async (orgId: string) => {
    const { data, error } = await supabase.from("messages").select("*").eq("org_id", orgId);
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

export const useTeamsStore = create<TeamsState>((set) => ({
  teams: [],
  fetchTeams: async (orgId: string) => {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        users:users_teams(
          user:users(*)
        )
      `)
      .eq("org_id", orgId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch teams");
    } else {
      // Transform the data to match our Team type
      const transformedTeams = data.map(team => ({
        ...team,
        users: team.users?.map(u => u.user)
      }));
      set({ teams: transformedTeams });
    }
  },
  fetchTeamById: async (teamId: string) => {
    const { data, error } = await supabase.from("teams").select("*, users:users_teams(user:users(*))").eq("id", teamId).single();
    if (error) {
      console.error(error);
    } else {
      const transformedTeam = {
        ...data,
        users: data.users?.map(u => u.user)
      };
      set((state) => {
        const existingTeamIndex = state.teams.findIndex(t => t.id === teamId);
        if (existingTeamIndex >= 0) {
          // Replace existing team
          const newTeams = [...state.teams];
          newTeams[existingTeamIndex] = transformedTeam;
          return { teams: newTeams };
        } else {
          // Add new team
          return { teams: [...state.teams, transformedTeam] };
        }
      });
    }
  },
  createTeam: async (team: Team) => {
    const { data, error } = await supabase.from("teams").insert(team).select("*, users:users_teams(user:users(*))");
    if (error) {
      console.error(error);
      toast.error("Failed to create team");
    }
  },
  updateTeam: async (team: Team) => {
    const { data, error } = await supabase.from("teams").update(team).eq("id", team.id).select("*, users:users_teams(user:users(*))").single();
    if (error) {
      console.error(error);
      toast.error("Failed to update team");
    } else {
      const transformedTeam = {
        ...data,
        users: data.users?.map(u => u.user)
      };
      set((state) => ({
        teams: state.teams.map((t) => (t.id === team.id ? transformedTeam : t)),
      }));
    }
  },
  removeTeam: async (teamId: string) => {
    const { data, error } = await supabase.from("teams").delete().eq("id", teamId);
    if (error) {
      console.error(error);
      toast.error("Failed to remove team");
    } else {
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== teamId),
      }));
    }
  },
  addUserToTeam: async (teamId: string, userId: string) => {
    const { data, error } = await supabase.from("users_teams").insert({
      team_id: teamId,
      user_id: userId,
    });
    if (error) {
      console.error(error);
      toast.error("Failed to add user to team");
    }
  },
  removeUserFromTeam: async (teamId: string, userId: string) => {
    const { data, error } = await supabase.from("users_teams").delete().eq("team_id", teamId).eq("user_id", userId);
    if (error) {
      console.error(error);
      toast.error("Failed to remove user from team");
    }
  },
}));

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  knowledgeBases: [],
  categories: [],
  articles: [],
  generationStatus: null,
  generatingKbId: null,
  generateCategoriesAndArticles: async (kbId: string, {brandVoiceExample, additionalNotes}: {brandVoiceExample: string, additionalNotes: string}) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    set({ generatingKbId: kbId });
    
    try {
      // First make the POST request to start the generation
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/knowledgebases/${kbId}/ai-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({brandVoiceExample, additionalNotes})
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const { generationId } = await response.json();

      // Then create EventSource with token and generationId in URL
      const eventSource = new EventSource(
        `${import.meta.env.VITE_API_URL}/api/knowledgebases/${kbId}/ai-generate/status?token=${session?.access_token}&generationId=${generationId}`
      );

      return new Promise((resolve, reject) => {
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          set({ generationStatus: data });
          
          if (data.status === 'completed' || data.status === 'error') {
            eventSource.close();
            set({ generatingKbId: null });
            if (data.status === 'completed') {
              resolve(data);
            } else {
              reject(new Error(data.message));
            }
          }
        };

        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          eventSource.close();
          set({ generatingKbId: null });
          reject(error);
        };
      });
    } catch (error) {
      set({ generatingKbId: null });
      throw error;
    }
  },
  fetchKnowledgeBases: async (orgId: string) => {
    const { data, error } = await supabase.from("knowledgebases").select("*").eq("org_id", orgId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch knowledge bases");
    } else {
      set({ knowledgeBases: data || [] });
    }
  },
  fetchKnowledgeBaseById: async (kbId: string) => {
    const { data, error } = await supabase.from("knowledgebases").select("*").eq("id", kbId).single();
    if (error) {
      console.error(error);
      toast.error("Failed to fetch knowledge base");
    } else {
      return data;
    }
  },
  fetchCategoriesByKnowledgeBaseId: async (kbId: string) => {
    const { data, error } = await supabase.from("categories").select("*").eq("knowledgebase_id", kbId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } else {
      return data;
    }
  },
  fetchArticlesByKnowledgeBaseId: async (kbId: string) => {
    const { data, error } = await supabase.from("articles").select("*").eq("knowledgebase_id", kbId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch articles");
    } else {
      return data;
    }
  },
  fetchCategories: async (orgId: string) => {
    const { data, error } = await supabase.from("categories").select("*").eq("org_id", orgId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } else {
      set({ categories: data || [] });
    }
  },
  fetchArticles: async (orgId: string) => {
    const { data, error } = await supabase.from("articles").select("*").eq("org_id", orgId);
    if (error) {
      console.error(error);
      toast.error("Failed to fetch articles");
    } else {
      set({ articles: data || [] });
    }
  },
  createKnowledgeBase: async (kb: KnowledgeBase) => {
    const { data, error } = await supabase.from("knowledgebases").insert(kb);
    if (error) {
      console.error(error);
      toast.error("Failed to create knowledge base");
    }
  },
  updateKnowledgeBase: async (kb: KnowledgeBase) => {
    const { error } = await supabase
      .from("knowledgebases")
      .update(kb)
      .eq("id", kb.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update knowledge base");
    }
  },
  createCategory: async (category: Category) => {
    const { data, error } = await supabase.from("categories").insert(category);
    if (error) {
      console.error(error);
      toast.error("Failed to create category");
    }
  },
  updateCategory: async (category: Category) => {
    const { error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", category.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  },
  createArticle: async (article: Article) => {
    const { data, error } = await supabase.from("articles").insert(article);
    if (error) {
      console.error(error);
      toast.error("Failed to create article");
    }
  },
  updateArticle: async (article: Article) => {
    const { data, error } = await supabase.from("articles").update(article).eq("id", article.id);
    if (error) {
      console.error(error);
      toast.error("Failed to update article");
    }
  },
  addKnowledgeBase: (kb: KnowledgeBase) =>
    set((state) => ({
      knowledgeBases: [...state.knowledgeBases, kb],
    })),
  receiveKnowledgeBaseUpdate: (kb: KnowledgeBase) =>
    set((state) => ({
      knowledgeBases: state.knowledgeBases.map((k) => (k.id === kb.id ? kb : k)),
    })),
  removeKnowledgeBase: (id: string) =>
    set((state) => ({
      knowledgeBases: state.knowledgeBases.filter((k) => k.id !== id),
    })),
  addCategory: (category: Category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  receiveCategoryUpdate: (category: Category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    })),
  removeCategory: (id: string) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  addArticle: (article: Article) =>
    set((state) => ({
      articles: [...state.articles, article],
    })),
  receiveArticleUpdate: (article: Article) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === article.id ? article : a)),
    })),
  removeArticle: (id: string) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
  deleteCategory: async (categoryId: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error(error);
      toast.error("Failed to delete category");
    } else {
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
      }));
    }
  },
  deleteArticle: async (articleId: string) => {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (error) {
      console.error(error);
      toast.error("Failed to delete article");
    } else {
      set((state) => ({
        articles: state.articles.filter((a) => a.id !== articleId),
      }));
    }
  },
  deleteKnowledgeBase: async (kbId: string) => {
    const { error } = await supabase
      .from("knowledgebases")
      .delete()
      .eq("id", kbId);

    if (error) {
      console.error(error);
      toast.error("Failed to delete knowledge base");
    } else {
      set((state) => ({
        knowledgeBases: state.knowledgeBases.filter((k) => k.id !== kbId),
      }));
    }
  },
}));
