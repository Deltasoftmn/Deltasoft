-- Supabase Storage Policies for news-images bucket
-- Run this SQL in your Supabase SQL Editor AFTER creating the news-images bucket

-- First, drop existing policies if they exist (optional, will error if they don't exist)
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can read images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;

-- Allow service_role to upload files (service_role bypasses RLS, but this ensures it works)
CREATE POLICY "Service role can upload images"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'news-images');

-- Allow service_role to read files
CREATE POLICY "Service role can read images"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'news-images');

-- Allow service_role to delete files
CREATE POLICY "Service role can delete images"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'news-images');

-- Allow public to read files (since bucket is public)
CREATE POLICY "Public can read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Alternative: Allow authenticated users to upload (if using auth)
-- Uncomment if you want authenticated users to upload too
-- CREATE POLICY "Allow authenticated uploads"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'news-images');
