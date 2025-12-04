import { NextResponse } from 'next/server';

// In production, this would use Vercel KV
// For local development, we'll use a simple in-memory store or localStorage approach

let configStore: Record<string, unknown> | null = null;

export async function GET() {
  try {
    // In production with Vercel KV:
    // const { kv } = await import('@vercel/kv');
    // const config = await kv.get('bio-config');
    
    if (configStore) {
      return NextResponse.json({ success: true, data: configStore });
    }
    
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production with Vercel KV:
    // const { kv } = await import('@vercel/kv');
    // await kv.set('bio-config', body);
    
    configStore = body;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save config' },
      { status: 500 }
    );
  }
}
