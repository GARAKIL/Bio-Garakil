# Bio Site - Copilot Instructions

## Project Overview
Персональный сайт-био с 3D-эффектами, кастомизацией и анимациями для размещения на Vercel.

## Tech Stack
- **Framework**: Next.js 14 с App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D**: Three.js + React Three Fiber + Drei
- **Animations**: Framer Motion
- **State**: Zustand
- **Database**: Vercel KV (опционально)

## Project Structure
```
src/
├── app/                  # Next.js App Router
│   ├── api/config/       # API для настроек
│   ├── globals.css       # Глобальные стили
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Главная страница
├── components/
│   ├── 3d/               # 3D сцена (Three.js)
│   ├── backgrounds/      # Компоненты фонов
│   ├── cursor/           # Кастомный курсор
│   ├── icons/            # SVG иконки
│   ├── music/            # Музыкальный плеер
│   ├── profile/          # Компоненты профиля
│   └── settings/         # Панель настроек
├── store/                # Zustand store
└── types/                # TypeScript типы
```

## Key Components

### Backgrounds
Доступные типы фонов: `rain`, `snow`, `particles`, `stars`, `gradient`, `noise`

### Cursor Styles
Доступные стили курсора: `default`, `glow`, `ring`, `trail`

### Customization
Все настройки хранятся в Zustand store и сохраняются в localStorage.

## Development Commands
- `npm run dev` - Запуск dev сервера
- `npm run build` - Production сборка
- `npm start` - Запуск production сервера

## Deployment
Проект готов для деплоя на Vercel. Просто подключите GitHub репозиторий.

### Vercel KV Setup
Для использования базы данных:
1. Создайте KV Store в Vercel Dashboard
2. Подключите к проекту
3. Раскомментируйте код в `src/app/api/config/route.ts`

## Customization Guide
- Замените `public/avatar.svg` на свой аватар
- Добавьте `public/music.mp3` для фоновой музыки
- Измените `src/types/config.ts` для настроек по умолчанию
