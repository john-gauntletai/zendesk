export interface User {
  id: string;
  created_at: string;
  display_name: string;
  org_id: string;
  role_id: string;
  email: string;
}

export interface CreateMessagePayload {
  conversation_id: string;
  content: string;
  attachments: any;
  sender_id: string;
  sender_type: string;
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
  org_id: string;
  channel: string;
  customer_id: string;
  status: string;
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

export interface Role {
  id: string;
  created_at: string;
  name: string;
}
