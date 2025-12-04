import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const CONFIG_KEY = 'bio-site-config';
const ADMIN_PASSWORD = 'Qwerty22';

// Поля с большими данными (base64), которые не сохраняем в KV
// URL-ы сохраняем!
const LARGE_DATA_FIELDS = ['backgroundVideo', 'customCursor', 'discordAvatar'];

// Check if KV is available
function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Фильтрует большие base64 данные перед сохранением
// URL-ы (http/https) сохраняются!
function filterLargeData(config: Record<string, unknown>): Record<string, unknown> {
  const filtered = { ...config };
  
  // Проверяем все поля на наличие base64 данных
  for (const [key, value] of Object.entries(filtered)) {
    if (typeof value === 'string' && value.startsWith('data:') && value.length > 5000) {
      // Это base64 данные - не сохраняем (кроме аватара до 50KB)
      if (key === 'avatar' && value.length < 50000) {
        continue; // Маленький аватар можно сохранить
      }
      filtered[key] = ''; // Очищаем большие base64
    }
  }
  
  return filtered;
}

// GET - получить конфиг (без пароля, публичный)
export async function GET() {
  try {
    console.log('GET /api/config - KV available:', isKVAvailable());
    
    if (isKVAvailable()) {
      const config = await kv.get(CONFIG_KEY);
      console.log('GET /api/config - config loaded:', config ? 'yes' : 'no');
      if (config) {
        return NextResponse.json({ success: true, data: config, source: 'kv' });
      }
    }
    
    return NextResponse.json({ success: true, data: null, source: 'none' });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ success: true, data: null, error: String(error) });
  }
}

// POST - сохранить конфиг (требуется пароль)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, config } = body;
    
    console.log('POST /api/config - password check');
    
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
      // Фильтруем большие данные перед сохранением
      const filteredConfig = filterLargeData(config);
      console.log('POST /api/config - saving filtered config, cursorStyle:', filteredConfig.cursorStyle);
      
      await kv.set(CONFIG_KEY, filteredConfig);
      return NextResponse.json({ 
        success: true, 
        message: 'Настройки сохранены',
        note: 'Большие файлы (картинки, музыка) не сохраняются на сервере'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'База данных не подключена' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка сохранения: ' + String(error) },
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
