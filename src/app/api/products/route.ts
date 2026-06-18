import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import localData from '../../../../backend/data/products.json';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = supabase.from('products').select('*');
        if (category) query = query.eq('category', category);

        const { data: cloudData, error } = await query;

        let finalData: any[] = [];

        if (error || !cloudData || cloudData.length === 0) {
            // Full fallback to local data when Supabase is down or empty
            finalData = [...localData];
            if (category) {
                finalData = finalData.filter(p => p.category === category);
            }
        } else {
            // Merge logic when Supabase is active
            finalData = [...cloudData];
            
            const hasCurtains = finalData.some(p => p.category === 'Curtains');
            if (!hasCurtains) {
                finalData = [...finalData, ...localData.filter(p => p.category === 'Curtains')];
            }

            const hasEJoy = finalData.some(p => p.name?.includes('E-Joy'));
            if (!hasEJoy) {
                finalData = [...finalData, ...localData.filter(p => p.category === 'Wallpapers' && p.name?.includes('E-Joy'))];
            }
        }

        return NextResponse.json(finalData, { status: 200 });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
