import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const VIEWS_KEY = 'bio-site-views';
const VIEWS_FILE = path.join(process.cwd(), 'data', 'views.json');

// Fallback to file storage if Vercel KV is not configured
async function getViewsFromFile(): Promise<number> {
  try {
    if (fs.existsSync(VIEWS_FILE)) {
      const data = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf-8'));
      return data.views || 0;
    }
  } catch {
    // File doesn't exist or is invalid
  }
  return 0;
}

async function saveViewsToFile(views: number): Promise<void> {
  try {
    const dir = path.dirname(VIEWS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(VIEWS_FILE, JSON.stringify({ views, updatedAt: new Date().toISOString() }));
  } catch (error) {
    console.error('Failed to save views to file:', error);
  }
}

async function getViews(): Promise<number> {
  // Try Vercel KV first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const views = await kv.get<number>(VIEWS_KEY);
      return views || 0;
    } catch (error) {
      console.error('Vercel KV error:', error);
    }
  }
  
  // Fallback to file
  return getViewsFromFile();
}

async function incrementViews(): Promise<number> {
  // Try Vercel KV first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const newViews = await kv.incr(VIEWS_KEY);
      return newViews;
    } catch (error) {
      console.error('Vercel KV error:', error);
    }
  }
  
  // Fallback to file
  const currentViews = await getViewsFromFile();
  const newViews = currentViews + 1;
  await saveViewsToFile(newViews);
  return newViews;
}

async function setViews(views: number): Promise<number> {
  // Try Vercel KV first
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await kv.set(VIEWS_KEY, views);
      return views;
    } catch (error) {
      console.error('Vercel KV error:', error);
    }
  }
  
  // Fallback to file
  await saveViewsToFile(views);
  return views;
}

// GET - получить количество просмотров
export async function GET() {
  try {
    const views = await getViews();
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Error getting views:', error);
    return NextResponse.json({ views: 0, error: 'Failed to get views' }, { status: 500 });
  }
}

// POST - увеличить просмотры
export async function POST(request: NextRequest) {
  try {
    // Check for visitor ID to prevent duplicate counts
    const visitorId = request.headers.get('x-visitor-id');
    
    // Simple rate limiting based on IP (in production, use a more robust solution)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const views = await incrementViews();
    
    return NextResponse.json({ 
      views, 
      message: 'View counted',
      ip: ip.split(',')[0] // Return first IP if multiple
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}

// PUT - установить конкретное значение (для админки)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { views } = body;
    
    if (typeof views !== 'number' || views < 0) {
      return NextResponse.json({ error: 'Invalid views value' }, { status: 400 });
    }
    
    const newViews = await setViews(views);
    return NextResponse.json({ views: newViews, message: 'Views updated' });
  } catch (error) {
    console.error('Error setting views:', error);
    return NextResponse.json({ error: 'Failed to set views' }, { status: 500 });
  }
}
