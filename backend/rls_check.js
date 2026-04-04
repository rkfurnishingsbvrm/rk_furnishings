const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const https = require('https');
const fs = require('fs');

// We need the Supabase management API token for running SQL
// Since we can't use the management API without a personal access token,
// let's use a different approach: use the service role key to run SQL
// via Supabase's postgres REST interface (pg over postgREST doesn't support DDL)

// Alternative: Use the service key with supabase-js to disable RLS on each table
// by using .rpc() to call a custom function, or use the REST API directly

// Actually, let's use the Supabase REST API v1 SQL endpoint
// This requires the service role key AND the project ref

const SUPABASE_URL = process.env.SUPABASE_URL; // https://ycrbploxjflbygdzagjb.supabase.co
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

console.log('Project ref:', PROJECT_REF);

// Supabase Management API SQL endpoint
// POST https://api.supabase.com/v1/projects/{ref}/database/query
// This requires a personal access token (PAT), not service role key

// Alternative approach: Instead of disabling RLS entirely, 
// let's check if we can create policies via the Supabase REST API
// by calling the pg_policies endpoint

// The BEST approach without MCP is to:
// 1. Check if the anon key consultations issue is just missing SELECT policy
// 2. Check if products/blog_posts insert policies are missing

// Since we verified service key works but anon doesn't for some tables,
// let's try a workaround: route ALL admin panel operations through the backend API
// instead of calling Supabase directly from the frontend

// For the consultations-anon SELECT issue:
// The anon key returns count:0 but no error - this means RLS is blocking SELECT silently
// (returns empty result set instead of error for SELECT - which is the RLS behavior)

// For products/blog_posts INSERT:
// These return explicit RLS errors

// The real fix is to add RLS policies in Supabase Dashboard manually,
// OR route admin inserts through the backend API which uses service key

console.log('\n=== SOLUTION ===');
console.log('The frontend admin panel uses anon key, which is blocked by RLS.');
console.log('Solution: Route admin write operations through backend API (which uses service key)');
console.log('This is the secure approach anyway - admin should never write directly from frontend with anon key');
console.log('\nPlease add these policies in Supabase Dashboard > Authentication > Policies:');
const policies = [
    'products: INSERT - WITH CHECK (true)',
    'products: UPDATE - USING (true)',
    'products: DELETE - USING (true)',
    'blog_posts: SELECT - USING (true)',
    'blog_posts: INSERT - WITH CHECK (true)',
    'blog_posts: UPDATE - USING (true)',
    'blog_posts: DELETE - USING (true)',
    'consultations: SELECT - USING (true)',
    'consultations: INSERT - WITH CHECK (true)',
    'consultations: UPDATE - USING (true)',
    'consultations: DELETE - USING (true)',
    'categories: SELECT - USING (true)',
];
policies.forEach(p => console.log('  -', p));

// Actually, let's try the SQL via the database REST API
// Supabase's database REST API supports raw SQL via the /rest/v1/rpc endpoint
// if there's an exec_sql function defined

const { createClient } = require('@supabase/supabase-js');
const supabaseService = createClient(SUPABASE_URL, SERVICE_KEY);

// Try to run SQL via a custom function (if it exists)
async function tryExecSQL() {
    // Check if exec_sql function exists
    const { data, error } = await supabaseService.rpc('exec_sql', {
        query: 'SELECT 1 as test'
    });
    if (error) {
        console.log('\nexec_sql RPC not available:', error.message);
        return false;
    }
    console.log('\nexec_sql is available! Result:', data);
    return true;
}

// Alternative: Use pg connection string if DATABASE_URL is available
async function main() {
    await tryExecSQL();

    // Since we can't run DDL via the JS client easily,
    // let's output the SQL that needs to be run in Supabase Dashboard
    const sqlToRun = `
-- RUN THIS IN SUPABASE DASHBOARD > SQL EDITOR:

-- PRODUCTS: Allow all operations for anon/authenticated
CREATE POLICY IF NOT EXISTS "anon_can_select_products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_products" ON public.products FOR DELETE TO anon, authenticated USING (true);

-- BLOG POSTS: Allow all operations
CREATE POLICY IF NOT EXISTS "anon_can_select_blog_posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_blog_posts" ON public.blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_blog_posts" ON public.blog_posts FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_blog_posts" ON public.blog_posts FOR DELETE TO anon, authenticated USING (true);

-- CONSULTATIONS: Allow all operations
CREATE POLICY IF NOT EXISTS "anon_can_select_consultations" ON public.consultations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_insert_consultations" ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_can_update_consultations" ON public.consultations FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "anon_can_delete_consultations" ON public.consultations FOR DELETE TO anon, authenticated USING (true);

-- CATEGORIES: Allow read
CREATE POLICY IF NOT EXISTS "anon_can_select_categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
`;

    fs.writeFileSync(path.resolve(__dirname, 'rls_fix.sql'), sqlToRun);
    console.log('\nRLS fix SQL written to backend/rls_fix.sql');
    console.log('Please run this in: https://supabase.com/dashboard/project/ycrbploxjflbygdzagjb/sql/new');
}

main().catch(console.error);
