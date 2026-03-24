'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/store/uiStore';
import { useCreateSchedule, useUpdateSchedule } from '@/hooks/useSchedules';
import {
  DAY_NAMES_FULL,
  SCHEDULE_COLORS,
  PRIORITY_LABELS,
  SCHEDULE_TYPE_LABELS,
  cn,
} from '@/lib/utils';
import { Schedule } from '@/types';

const defaultForm = {
  title: '',
  schedule_type: 'class' as Schedule['schedule_type'],
  day_of_week: 0,
  date: '',
  start_time: '09:00',
  end_time: '10:00',
  location: '',
  color: '#6366F1',
  priority: 0 as Schedule['priority'],
  is_completed: false,
};

export function ClassForm() {
  const { isClassFormOpen, editingSchedule, closeClassForm } = useUIStore();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSchedule) {
      setForm({
        title: editingSchedule.title,
        schedule_type: editingSchedule.schedule_type,
        day_of_week: editingSchedule.day_of_week,
        date: editingSchedule.date || '',
        start_time: editingSchedule.start_time,
        end_time: editingSchedule.end_time,
        location: editingSchedule.location || '',
        color: editingSchedule.color,
        priority: editingSchedule.priority,
        is_completed: editingSchedule.is_completed,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingSchedule, isClassFormOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = '제목을 입력해주세요';
    if (!form.start_time) newErrors.start_time = '시작 시간을 입력해주세요';
    if (!form.end_time) newErrors.end_time = '종료 시간을 입력해주세요';
    if (form.start_time >= form.end_time) newErrors.end_time = '종료 시간은 시작 시간 이후여야 합니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title,
      schedule_type: form.schedule_type,
      day_of_week: form.day_of_week,
      date: form.date || undefined,
      start_time: form.start_time,
      end_time: form.end_time,
      location: form.location || undefined,
      color: form.color,
      priority: form.priority,
      is_completed: form.is_completed,
    };

    if (editingSchedule) {
      updateSchedule.mutate(
        { id: editingSchedule.id, ...payload },
        {
          onSuccess: () => {
            toast.success('일정이 수정되었습니다');
            closeClassForm();
          },
          onError: () => toast.error('수정 중 오류가 발생했습니다'),
        }
      );
    } else {
      createSchedule.mutate(payload, {
        onSuccess: () => {
          toast.success('일정이 추가되었습니다');
          closeClassForm();
        },
        onError: () => toast.error('추가 중 오류가 발생했습니다'),
      });
    }
  };

  const isPending = createSchedule.isPending || updateSchedule.isPending;

  return (
    <Dialog open={isClassFormOpen} onOpenChange={(open) => !open && closeClassForm()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSchedule ? '일정 수정' : '일정 추가'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="일정 제목"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          {/* Schedule Type */}
          <div className="space-y-1.5">
            <Label>유형</Label>
            <Select
              value={form.schedule_type}
              onValueChange={(v) => setForm({ ...form, schedule_type: v as Schedule['schedule_type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SCHEDULE_TYPE_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day of Week */}
          <div className="space-y-1.5">
            <Label>요일</Label>
            <Select
              value={String(form.day_of_week)}
              onValueChange={(v) => setForm({ ...form, day_of_week: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_NAMES_FULL.map((day, idx) => (
                  <SelectItem key={idx} value={String(idx)}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="date">날짜 (선택)</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start_time">시작 시간 *</Label>
              <Input
                id="start_time"
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && <p className="text-red-500 text-xs">{errors.start_time}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_time">종료 시간 *</Label>
              <Input
                id="end_time"
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && <p className="text-red-500 text-xs">{errors.end_time}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location">장소 (선택)</Label>
            <Input
              id="location"
              placeholder="장소를 입력하세요"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>색상</Label>
            <div className="flex gap-2">
              {SCHEDULE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                    form.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label>우선순위</Label>
            <Select
              value={String(form.priority)}
              onValueChange={(v) => setForm({ ...form, priority: Number(v) as Schedule['priority'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Completed */}
          {editingSchedule && (
            <div className="flex items-center gap-2">
              <input
                id="is_completed"
                type="checkbox"
                checked={form.is_completed}
                onChange={(e) => setForm({ ...form, is_completed: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
              />
              <Label htmlFor="is_completed" className="cursor-pointer">완료 표시</Label>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeClassForm}>
              취소
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isPending}>
              {isPending ? '저장 중...' : editingSchedule ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
