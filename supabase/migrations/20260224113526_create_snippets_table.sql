BEGIN;

CREATE TABLE IF NOT EXISTS snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public snippets are viewable by everyone" 
  ON snippets FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can insert their own snippets" 
  ON snippets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets" 
  ON snippets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets" 
  ON snippets FOR DELETE 
  USING (auth.uid() = user_id);

COMMIT;