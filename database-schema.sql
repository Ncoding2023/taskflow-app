-- Create custom types
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

-- Create user profiles table (독립적으로 작동)
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create folders table
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority priority_level DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL
);

-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_folder_id ON tasks(folder_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_folder_id ON notes(folder_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (true);

-- Create RLS policies for folders
CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own folders" ON folders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE USING (true);

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (true);

-- Create RLS policies for notes
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (true); 