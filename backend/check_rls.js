const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

// Use service key - bypasses RLS
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkAndReport() {
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Has service key:', !!process.env.SUPABASE_SERVICE_KEY);

    // Test 1: Read consultations with service key
    const { data: consultations, error: cErr } = await supabase
        .from('consultations')
        .select('id, user_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
    console.log('\n=== CONSULTATIONS (Service Key) ===');
    if (cErr) console.log('ERROR:', cErr.message);
    else console.log('Count:', consultations?.length, '\nData:', JSON.stringify(consultations, null, 2));

    // Test 2: Read consultations with ANON key
    const supabaseAnon = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    const { data: consultationsAnon, error: cAnonErr } = await supabaseAnon
        .from('consultations')
        .select('id, user_name, status')
        .limit(3);
    console.log('\n=== CONSULTATIONS (Anon Key) ===');
    if (cAnonErr) console.log('ERROR (anon):', cAnonErr.message, cAnonErr.code);
    else console.log('Count:', consultationsAnon?.length, '\nData:', JSON.stringify(consultationsAnon, null, 2));

    // Test 3: Check products with anon
    const { data: products, error: pErr } = await supabaseAnon
        .from('products')
        .select('id, name, category')
        .limit(3);
    console.log('\n=== PRODUCTS (Anon Key) ===');
    if (pErr) console.log('ERROR:', pErr.message, pErr.code);
    else console.log('Count:', products?.length, '\nData:', JSON.stringify(products, null, 2));

    // Test 4: Insert a test product with anon
    const { data: insertResult, error: insertErr } = await supabaseAnon
        .from('products')
        .insert([{ name: 'Test Product', category: 'Curtains', description: 'Test', images: [], is_featured: false }])
        .select()
        .single();
    console.log('\n=== INSERT PRODUCT (Anon Key) ===');
    if (insertErr) console.log('INSERT ERROR:', insertErr.message, insertErr.code);
    else {
        console.log('INSERT SUCCESS:', JSON.stringify(insertResult, null, 2));
        // Clean up
        await supabaseAnon.from('products').delete().eq('id', insertResult.id);
    }
}

checkAndReport().catch(console.error);
