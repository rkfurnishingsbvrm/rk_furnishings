import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = supabase.from('products').select('*');
        if (category) query = query.eq('category', category);

        const { data: cloudData, error } = await query;

        // Fallback or Merge with local data
        let localData = [];
        try {
            const filePath = path.join(process.cwd(), 'backend/data/products.json');
            if (fs.existsSync(filePath)) {
                localData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (e) {
            console.error("Local data read error:", e);
        }

        let finalData = cloudData || [];

        // Merge logic
        const hasCurtains = finalData.some(p => p.category === 'Curtains');
        if (!hasCurtains) {
            finalData = [...finalData, ...localData.filter(p => p.category === 'Curtains')];
        }

        const hasEJoy = finalData.some(p => p.name?.includes('E-Joy'));
        if (!hasEJoy) {
            finalData = [...finalData, ...localData.filter(p => p.category === 'Wallpapers' && p.name?.includes('E-Joy'))];
        }

        return NextResponse.json(finalData, { status: 200 });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
