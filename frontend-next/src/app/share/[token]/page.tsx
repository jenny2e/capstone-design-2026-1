import { Suspense } from 'react';
import { SharedTimetable } from './SharedTimetable';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">시</span>
          </div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">스마트 시간표</h1>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          읽기 전용
        </span>
      </header>
      <main className="p-4 max-w-6xl mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SharedTimetable token={token} />
        </Suspense>
      </main>
    </div>
  );
}
