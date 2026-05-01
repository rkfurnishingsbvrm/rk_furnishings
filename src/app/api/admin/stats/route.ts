import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
    let stats = { totalProducts: 0, totalBlogPosts: 0, recentConsultations: 0 };
    
    try {
        const [productsRes, blogRes, consultationsRes] = await Promise.all([
            supabase.from('products').select('id', { count: 'exact', head: true }),
            supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
            supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);
        
        stats.totalProducts = productsRes.count || 0;
        stats.totalBlogPosts = blogRes.count || 0;
        stats.recentConsultations = consultationsRes.count || 0;
    } catch (dbErr) {
        // Local fallbacks
        try {
            const productsPath = path.join(process.cwd(), 'backend/data/products.json');
            if (fs.existsSync(productsPath)) {
                stats.totalProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8')).length;
            }
        } catch (e) {}
    }

    return NextResponse.json(stats);
}
