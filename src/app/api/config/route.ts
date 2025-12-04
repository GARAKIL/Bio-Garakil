import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const CONFIG_KEY = 'bio-site-config';
const ADMIN_PASSWORD = 'Qwerty22';

// Check if KV is available
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// GET - получить конфиг (без пароля, публичный)
export async function GET() {
  try {
    if (isKVAvailable()) {
      const config = await kv.get(CONFIG_KEY);
      if (config) {
        return NextResponse.json({ success: true, data: config });
      }
    }
    
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ success: true, data: null });
  }
}

// POST - сохранить конфиг (требуется пароль)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, config } = body;
    
    // Проверка пароля
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Неверный пароль' },
        { status: 401 }
      );
    }
    
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Конфиг не указан' },
        { status: 400 }
      );
    }
    
    if (isKVAvailable()) {
      await kv.set(CONFIG_KEY, config);
      return NextResponse.json({ success: true, message: 'Настройки сохранены' });
    } else {
      return NextResponse.json(
        { success: false, error: 'База данных не подключена' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сохранения' },
      { status: 500 }
    );
  }
}

// DELETE - сбросить конфиг (требуется пароль)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Неверный пароль' },
        { status: 401 }
      );
    }
    
    if (isKVAvailable()) {
      await kv.del(CONFIG_KEY);
      return NextResponse.json({ success: true, message: 'Настройки сброшены' });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting config:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сброса' },
      { status: 500 }
    );
  }
}
