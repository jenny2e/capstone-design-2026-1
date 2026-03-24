'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Schedule } from '@/types';
import { DAY_NAMES, timeToMinutes, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useDeleteSchedule } from '@/hooks/useSchedules';
import { useUIStore } from '@/store/uiStore';
import { toast } from 'sonner';

const START_HOUR = 8;
const END_HOUR = 22;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const HOUR_HEIGHT = 60; // px per hour
const GRID_HEIGHT = TOTAL_MINUTES; // 1px per minute

interface TimetableProps {
  schedules: Schedule[];
  readOnly?: boolean;
}

function getTopPercent(time: string): number {
  const minutes = timeToMinutes(time) - START_HOUR * 60;
  return (Math.max(0, minutes) / TOTAL_MINUTES) * 100;
}

function getHeightPercent(start: string, end: string): number {
  const startMin = Math.max(timeToMinutes(start), START_HOUR * 60);
  const endMin = Math.min(timeToMinutes(end), END_HOUR * 60);
  return ((endMin - startMin) / TOTAL_MINUTES) * 100;
}

function hasConflict(a: Schedule, b: Schedule): boolean {
  if (a.day_of_week !== b.day_of_week) return false;
  const aStart = timeToMinutes(a.start_time);
  const aEnd = timeToMinutes(a.end_time);
  const bStart = timeToMinutes(b.start_time);
  const bEnd = timeToMinutes(b.end_time);
  return aStart < bEnd && bStart < aEnd;
}

interface ScheduleBlockProps {
  schedule: Schedule;
  isConflict: boolean;
  readOnly: boolean;
  onEdit: (s: Schedule) => void;
  onDelete: (id: number) => void;
}

function ScheduleBlock({ schedule, isConflict, readOnly, onEdit, onDelete }: ScheduleBlockProps) {
  const [hovered, setHovered] = useState(false);
  const top = getTopPercent(schedule.start_time);
  const height = getHeightPercent(schedule.start_time, schedule.end_time);

  const priorityDot =
    schedule.priority === 2
      ? 'bg-orange-500'
      : schedule.priority === 1
      ? 'bg-yellow-400'
      : null;

  return (
    <div
      className={cn(
        'absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 text-white text-xs overflow-hidden cursor-pointer group transition-opacity',
        isConflict && 'ring-2 ring-red-400 ring-offset-1',
        schedule.is_completed && 'opacity-60'
      )}
      style={{
        top: `${top}%`,
        height: `${Math.max(height, 2)}%`,
        backgroundColor: schedule.color || '#6366F1',
        minHeight: '24px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !readOnly && onEdit(schedule)}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 font-semibold leading-tight truncate">
            {priorityDot && (
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', priorityDot)} />
            )}
            <span className="truncate">{schedule.title}</span>
          </div>
          {height > 4 && (
            <div className="text-white/80 text-[10px] truncate">
              {schedule.start_time} - {schedule.end_time}
            </div>
          )}
          {schedule.location && height > 6 && (
            <div className="text-white/70 text-[10px] truncate">📍 {schedule.location}</div>
          )}
        </div>
        {!readOnly && hovered && (
          <button
            className="flex-shrink-0 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(schedule.id);
            }}
          >
            ✕
          </button>
        )}
      </div>
      {schedule.is_completed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-white/60"></div>
        </div>
      )}
    </div>
  );
}

export function Timetable({ schedules, readOnly = false }: TimetableProps) {
  const openClassForm = useUIStore((s) => s.openClassForm);
  const deleteSchedule = useDeleteSchedule();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null);

  const updateCurrentTime = useCallback(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes() - START_HOUR * 60;
    if (minutes >= 0 && minutes <= TOTAL_MINUTES) {
      setCurrentTimeTop((minutes / TOTAL_MINUTES) * 100);
    } else {
      setCurrentTimeTop(null);
    }
  }, []);

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  const handleDelete = (id: number) => {
    if (confirm('일정을 삭제하시겠습니까?')) {
      deleteSchedule.mutate(id, {
        onSuccess: () => toast.success('일정이 삭제되었습니다'),
        onError: () => toast.error('삭제 중 오류가 발생했습니다'),
      });
    }
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  const schedulesByDay = DAY_NAMES.map((_, dayIdx) =>
    schedules.filter((s) => s.day_of_week === dayIdx)
  );

  const conflictIds = new Set<number>();
  schedules.forEach((a) => {
    schedules.forEach((b) => {
      if (a.id !== b.id && hasConflict(a, b)) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
      }
    });
  });

  return (
    <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
      <div className="min-w-[700px]">
        {/* Header row */}
        <div className="flex border-b">
          <div className="w-12 flex-shrink-0" />
          {DAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={cn(
                'flex-1 text-center py-3 text-sm font-semibold',
                i === 5 && 'text-blue-600 dark:text-blue-400',
                i === 6 && 'text-red-600 dark:text-red-400'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex" ref={containerRef}>
          {/* Time labels */}
          <div className="w-12 flex-shrink-0 relative" style={{ height: `${GRID_HEIGHT}px` }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute right-2 text-[10px] text-gray-400 dark:text-gray-500 -translate-y-2"
                style={{ top: `${((hour - START_HOUR) * 60 / TOTAL_MINUTES) * 100}%` }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAY_NAMES.map((_, dayIdx) => {
            const daySchedules = schedulesByDay[dayIdx];
            return (
              <div
                key={dayIdx}
                className="flex-1 relative border-l"
                style={{ height: `${GRID_HEIGHT}px` }}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-gray-100 dark:border-gray-800"
                    style={{ top: `${((hour - START_HOUR) / (END_HOUR - START_HOUR)) * 100}%` }}
                  />
                ))}

                {/* Current time indicator */}
                {currentTimeTop !== null && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{ top: `${currentTimeTop}%` }}
                  >
                    <div className="relative">
                      <div className="absolute -left-1 w-2 h-2 rounded-full bg-red-500 -translate-y-1" />
                      <div className="h-px bg-red-400" />
                    </div>
                  </div>
                )}

                {/* Schedule blocks */}
                {daySchedules.map((schedule) => (
                  <ScheduleBlock
                    key={schedule.id}
                    schedule={schedule}
                    isConflict={conflictIds.has(schedule.id)}
                    readOnly={readOnly}
                    onEdit={openClassForm}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
