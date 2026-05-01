import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, phone, email, serviceType, productInterest, preferredDate, message } = body;

        // Try to save to Supabase
        const { data, error } = await supabase
            .from('consultations')
            .insert([{
                user_name: userName,
                phone,
                email,
                service_type: serviceType,
                product_interest: productInterest,
                preferred_date: preferredDate,
                message,
                status: 'pending'
            }])
            .select();

        if (error) {
            console.error('Supabase booking error:', error);
            // Fallback: In a real app we might use a local DB or email notification
            // For now, if Supabase fails on live, we return an error
            return NextResponse.json({ message: 'Database error. Please try again later.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Booking successful', data }, { status: 200 });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
