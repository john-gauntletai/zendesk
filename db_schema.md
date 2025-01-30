# Database Structure

## Tables

### users
- id (uuid, PK, references auth.users.id)
- created_at (timestamptz)
- full_name (text)
- org_id (uuid, FK references orgs.id)
- role_id (uuid, FK references roles.id)
- email (text)
- avatar_url (text)

### teams
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- org_id (uuid, FK references orgs.id)
- emoji_icon (text)

### users_teams
- user_id (uuid, FK references users.id)
- team_id (uuid, FK references teams.id)

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

### tags
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- background_color (text)
- text_color (text)
- org_id (uuid, FK references orgs.id)
- created_by (uuid, FK references users.id)

### conversations_tags
- conversation_id (uuid, FK references conversations.id)
- tag_id (uuid, FK references tags.id)

### customers
- id (uuid, PK)
- created_at (timestamptz)
- full_name (text)
- email (text)
- org_id (uuid, FK references orgs.id)
- avatar_url (text)

### orgs
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- logoUrl (text)

### roles
- id (uuid, PK)
- created_at (timestamptz)
- name (text)

### knowledgebases
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- logo_url (text)
- description (text)
- theme_color (text)
- org_id (uuid, FK references orgs.id)

### categories
- id (uuid, PK)
- created_at (timestamptz)
- name (text)
- emoji_icon (text)
- knowledgebase_id (uuid, FK references knowledgebases.id)

### articles
- id (uuid, PK)
- created_at (timestamptz)
- title (text)
- body (text)
- status (text)
- category_id (uuid, FK references categories.id)
- knowledgebase_id (uuid, FK references knowledgebases.id)
- org_id (uuid, FK references orgs.id)
- created_by (uuid, FK references users.id)
- last_updated_by (uuid, FK references users.id)
- last_updated_at (timestamptz)

## Relationships
- users.id -> auth.users.id
- users.org_id -> orgs.id
- users.role_id -> roles.id
- messages.conversation_id -> conversations.id
- conversations.org_id -> orgs.id
- conversations.customer_id -> customers.id
- customers.org_id -> orgs.id
- conversations_tags.conversation_id -> conversations.id
- conversations_tags.tag_id -> tags.id
- tags.org_id -> orgs.id
- tags.created_by -> users.id
- users_teams.user_id -> users.id
- users_teams.team_id -> teams.id
- knowledgebases.org_id -> orgs.id
- categories.knowledgebase_id -> knowledgebases.id
- articles.org_id -> orgs.id
- articles.created_by -> users.id
- articles.last_updated_by -> users.id
- articles.category_id -> categories.id
- articles.knowledgebase_id -> knowledgebases.id