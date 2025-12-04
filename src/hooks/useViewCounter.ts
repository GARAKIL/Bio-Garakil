'use client';

import { useEffect, useState, useCallback } from 'react';

const VIEWED_SESSION_KEY = 'bio-viewed-session';

export function useViewCounter() {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузить текущее количество просмотров
  const fetchViews = useCallback(async () => {
    try {
      const response = await fetch('/api/views');
      const data = await response.json();
      setViewCount(data.views || 0);
    } catch (error) {
      console.error('Failed to fetch views:', error);
    }
  }, []);

  // Увеличить просмотры
  const incrementViews = useCallback(async () => {
    try {
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-visitor-id': getVisitorId(),
        },
      });
      const data = await response.json();
      setViewCount(data.views || 0);
      return data.views;
    } catch (error) {
      console.error('Failed to increment views:', error);
      return viewCount;
    }
  }, [viewCount]);

  // Установить конкретное значение (для админки)
  const setCount = useCallback(async (count: number) => {
    try {
      const response = await fetch('/api/views', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ views: count }),
      });
      const data = await response.json();
      setViewCount(data.views || count);
    } catch (error) {
      console.error('Failed to set views:', error);
      setViewCount(count);
    }
  }, []);

  // Сбросить счётчик
  const resetCount = useCallback(async () => {
    await setCount(0);
    sessionStorage.removeItem(VIEWED_SESSION_KEY);
  }, [setCount]);

  useEffect(() => {
    const init = async () => {
      // Проверяем, был ли уже засчитан просмотр в этой сессии
      const alreadyViewed = sessionStorage.getItem(VIEWED_SESSION_KEY);
      
      if (!alreadyViewed) {
        // Новый посетитель - увеличиваем счётчик
        await incrementViews();
        sessionStorage.setItem(VIEWED_SESSION_KEY, Date.now().toString());
      } else {
        // Уже был - просто загружаем текущее значение
        await fetchViews();
      }
      
      setIsLoading(false);
    };

    init();
  }, [fetchViews, incrementViews]);

  return { viewCount, isLoading, setCount, resetCount, refetch: fetchViews };
}

// Генерация уникального ID посетителя
function getVisitorId(): string {
  const storageKey = 'bio-visitor-id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
}

