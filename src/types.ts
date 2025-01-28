export interface User {
  id: string;
  created_at: string;
  full_name: string;
  org_id: string;
  role_id: string;
  email: string;
}

export interface Role {
  id: string;
  created_at: string;
  name: string;
}

export interface CreateMessagePayload {
  conversation_id: string;
  content: string;
  attachments: any;
  sender_id: string;
  sender_type: 'user' | 'customer';
  org_id: string;
}

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  content: string;
  attachments: any; // jsonb type
  sender_id: string;
  sender_type: 'user' | 'customer';
}

export interface Conversation {
  id: string;
  created_at: string;
  subject: string;
  status: string; 
  channel: string;
  customer_id: string;
  assigned_to?: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  created_at: string;
  name: string;
  background_color: string;
  text_color: string;
  org_id: string;
  created_by: string;
}

export interface Customer {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  org_id: string;
  conversations?: Conversation[];
}

export interface Organization {
  id: string;
  created_at: string;
  name: string;
  logoUrl: string;
}

export interface Team {
  id: string;
  created_at: string;
  name: string;
  emoji_icon: string;
  org_id: string;
  users?: User[];
}
