const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Extract project ref from URL: https://ycrbploxjflbygdzagjb.supabase.co
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

const queries = [
    // Products
    `ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY`,
    `DROP POLICY IF EXISTS "Allow public read products" ON products`,
    `CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true)`,
    `DROP POLICY IF EXISTS "Allow insert products" ON products`,
    `CREATE POLICY "Allow insert products" ON products FOR INSERT WITH CHECK (true)`,
    `DROP POLICY IF EXISTS "Allow update products" ON products`,
    `CREATE POLICY "Allow update products" ON products FOR UPDATE USING (true)`,
    `DROP POLICY IF EXISTS "Allow delete products" ON products`,
    `CREATE POLICY "Allow delete products" ON products FOR DELETE USING (true)`,
    // Blog posts
    `ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY`,
    `DROP POLICY IF EXISTS "Allow public read blog_posts" ON blog_posts`,
    `CREATE POLICY "Allow public read blog_posts" ON blog_posts FOR SELECT USING (true)`,
    `DROP POLICY IF EXISTS "Allow insert blog_posts" ON blog_posts`,
    `CREATE POLICY "Allow insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (true)`,
    `DROP POLICY IF EXISTS "Allow update blog_posts" ON blog_posts`,
    `CREATE POLICY "Allow update blog_posts" ON blog_posts FOR UPDATE USING (true)`,
    `DROP POLICY IF EXISTS "Allow delete blog_posts" ON blog_posts`,
    `CREATE POLICY "Allow delete blog_posts" ON blog_posts FOR DELETE USING (true)`,
    // Consultations
    `ALTER TABLE IF EXISTS consultations ENABLE ROW LEVEL SECURITY`,
    `DROP POLICY IF EXISTS "Allow public insert consultations" ON consultations`,
    `CREATE POLICY "Allow public insert consultations" ON consultations FOR INSERT WITH CHECK (true)`,
    `DROP POLICY IF EXISTS "Allow read consultations" ON consultations`,
    `CREATE POLICY "Allow read consultations" ON consultations FOR SELECT USING (true)`,
    `DROP POLICY IF EXISTS "Allow update consultations" ON consultations`,
    `CREATE POLICY "Allow update consultations" ON consultations FOR UPDATE USING (true)`,
    `DROP POLICY IF EXISTS "Allow delete consultations" ON consultations`,
    `CREATE POLICY "Allow delete consultations" ON consultations FOR DELETE USING (true)`,
    // Categories
    `ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY`,
    `DROP POLICY IF EXISTS "Allow public read categories" ON categories`,
    `CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true)`,
];

async function runQuery(sql) {
    const body = JSON.stringify({ query: sql });
    const url = new URL(`${SUPABASE_URL}/rest/v1/`);

    return new Promise((resolve, reject) => {
        const options = {
            hostname: `${PROJECT_REF}.supabase.co`,
            path: `/rest/v1/rpc/exec_sql`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Length': Buffer.byteLength(body),
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// Use pg directly via Supabase's database URL pattern or use the REST API
// Since we can't run raw SQL via REST easily, let's try a different approach
// Use the Supabase JS client with service role to disable RLS temporarily

async function main() {
    console.log('Project ref:', PROJECT_REF);
    console.log('Using service key for RLS fix...');

    // Test connection
    const testUrl = `${SUPABASE_URL}/rest/v1/consultations?select=count&limit=1`;
    const response = await fetch(testUrl, {
        headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Profile': 'public',
            'Prefer': 'count=exact',
        }
    });
    const text = await response.text();
    console.log('Test SELECT consultations status:', response.status, 'body:', text.slice(0, 200));

    // Try inserting a test product
    const insertTest = await fetch(`${SUPABASE_URL}/rest/v1/consultations?select=id,user_name,status`, {
        headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
        }
    });
    const insertText = await insertTest.text();
    console.log('Service role SELECT consultations:', insertTest.status, insertText.slice(0, 300));
}

main().catch(console.error);
