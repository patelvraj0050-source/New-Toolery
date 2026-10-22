-- =========================================================
-- TOOLERY NEXT-GEN SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- =========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.toolery_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'Pro Community',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. History Records Table (Logs every tool operation)
CREATE TABLE IF NOT EXISTS public.toolery_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed',
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Files Records Table (Tracks processed/converted files)
CREATE TABLE IF NOT EXISTS public.toolery_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size BIGINT DEFAULT 0,
    type TEXT,
    action TEXT,
    status TEXT DEFAULT 'Completed',
    storage_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Favorites Table (Stores user pinned favorite tools)
CREATE TABLE IF NOT EXISTS public.toolery_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, tool_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.toolery_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolery_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolery_favorites ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own records
CREATE POLICY "Users can manage their own profile" 
ON public.toolery_profiles FOR ALL 
USING (auth.uid() = id);

CREATE POLICY "Users can manage their history" 
ON public.toolery_history FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage their files" 
ON public.toolery_files FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage their favorites" 
ON public.toolery_favorites FOR ALL 
USING (auth.uid() = user_id);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_toolery_history_user_id ON public.toolery_history(user_id);
CREATE INDEX IF NOT EXISTS idx_toolery_history_created_at ON public.toolery_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_toolery_files_user_id ON public.toolery_files(user_id);
