-- Waitlist Table Schema for Supabase
-- Run this in your Supabase SQL Editor to create the waitlist table

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('results', 'landing', 'waitlist_page')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for joining waitlist)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous select (to check if email exists)
CREATE POLICY "Allow anonymous select" ON waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Optional: Create a function to get waitlist count
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM waitlist);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a view for admin dashboard (only accessible to authenticated users)
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT
  source,
  COUNT(*) as count,
  MAX(created_at) as last_signup
FROM waitlist
GROUP BY source;

COMMENT ON TABLE waitlist IS 'Stores email addresses for premium features waitlist';
COMMENT ON COLUMN waitlist.email IS 'User email address (unique, lowercase)';
COMMENT ON COLUMN waitlist.source IS 'Where the user signed up from (results, landing, waitlist_page)';
COMMENT ON COLUMN waitlist.created_at IS 'Timestamp when the user joined the waitlist';
