# Database Structure

## Tables

### users
- id (uuid, PK, references auth.users.id)
- created_at (timestamptz)
- display_name (text)
- org_id (uuid, FK references orgs.id)
- role_id (uuid, FK references roles.id)
- email (text)
- avatar_url (text)

### messages
- id (uuid, PK)
- created_at (timestamptz)
- conversation_id (uuid, FK references conversations.id)
- content (text)
- attachments (jsonb)
- sender_id (uuid)
- sender_type (text)

### conversations
- id (uuid, PK)
- created_at (timestamptz)
- org_id (uuid, FK references orgs.id)
- channel (text)
- customer_id (uuid, FK references customers.id)
- status (text)
- assigned_to (uuid, FK references users.id)

### customers
- id (uuid, PK)
- created_at (timestamptz)
- full_name (text)
- email (text)
- org_id (uuid, FK references orgs.id)

### orgs
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- logoUrl (text)

### roles
- id (uuid, PK)
- created_at (timestamptz)
- name (text)

## Relationships
- users.id -> auth.users.id
- users.org_id -> orgs.id
- users.role_id -> roles.id
- messages.conversation_id -> conversations.id
- conversations.org_id -> orgs.id
- conversations.customer_id -> customers.id
- customers.org_id -> orgs.id
