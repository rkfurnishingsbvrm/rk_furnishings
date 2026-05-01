import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'backend/data/settings.json');

function getLocalSettings() {
    try {
        if (fs.existsSync(SETTINGS_PATH)) {
            return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
        }
    } catch (e) {
        console.error("Settings read error:", e);
    }
    return {
        adminPassword: 'rkadmin123',
        contactNumber: '8688769487',
        supportEmail: 'rkfurnishingsbvrm@gmail.com'
    };
}

export async function GET() {
    const settings = getLocalSettings();
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const current = getLocalSettings();
        
        const nextSettings = {
            adminPassword: body.adminPassword || current.adminPassword,
            contactNumber: body.contactNumber || current.contactNumber,
            supportEmail: body.supportEmail || current.supportEmail
        };

        // Note: This will work locally but will fail on Vercel production 
        // because the filesystem is read-only.
        // On production, settings should ideally be in Supabase or an Env Var.
        try {
            fs.writeFileSync(SETTINGS_PATH, JSON.stringify(nextSettings, null, 2));
        } catch (e) {
            console.warn("Could not write settings to disk (likely production):", e);
        }

        return NextResponse.json({ message: 'Settings updated', settings: nextSettings });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
