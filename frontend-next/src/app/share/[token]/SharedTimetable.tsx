'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Schedule } from '@/types';
import { Timetable } from '@/components/timetable/Timetable';

interface SharedData {
  schedules: Schedule[];
  username?: string;
}

export function SharedTimetable({ token }: { token: string }) {
  const [data, setData] = useState<SharedData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SharedData>(`/share/${token}`)
      .then(({ data }) => {
        setData(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          시간표를 찾을 수 없습니다
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          링크가 만료되었거나 잘못된 링크입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.username && (
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          {data.username}님의 시간표
        </p>
      )}
      <Timetable schedules={data.schedules} readOnly />
    </div>
  );
}
