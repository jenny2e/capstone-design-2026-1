'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useExams, useCreateExam, useDeleteExam } from '@/hooks/useExams';
import { formatDate } from '@/lib/utils';
import { ExamSchedule } from '@/types';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(dateStr);
  examDate.setHours(0, 0, 0, 0);
  return Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ExamBadge({ days }: { days: number }) {
  if (days < 0) return <Badge variant="secondary">종료</Badge>;
  if (days === 0) return <Badge className="bg-red-500 hover:bg-red-600">오늘</Badge>;
  if (days <= 3) return <Badge className="bg-orange-500 hover:bg-orange-600">{days}일 후</Badge>;
  if (days <= 7) return <Badge className="bg-yellow-500 hover:bg-yellow-600">{days}일 후</Badge>;
  return <Badge variant="outline">{days}일 후</Badge>;
}

const defaultForm = {
  title: '',
  subject: '',
  exam_date: '',
  exam_time: '',
  location: '',
};

export function ExamList() {
  const { data: exams, isLoading } = useExams();
  const createExam = useCreateExam();
  const deleteExam = useDeleteExam();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = '시험 이름을 입력해주세요';
    if (!form.exam_date) newErrors.exam_date = '시험 날짜를 선택해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Omit<ExamSchedule, 'id' | 'user_id'> = {
      title: form.title,
      subject: form.subject || undefined,
      exam_date: form.exam_date,
      exam_time: form.exam_time || undefined,
      location: form.location || undefined,
    };

    createExam.mutate(payload, {
      onSuccess: () => {
        toast.success('시험 일정이 추가되었습니다');
        setIsOpen(false);
        setForm(defaultForm);
        setErrors({});
      },
      onError: () => toast.error('추가 중 오류가 발생했습니다'),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('시험 일정을 삭제하시겠습니까?')) {
      deleteExam.mutate(id, {
        onSuccess: () => toast.success('시험 일정이 삭제되었습니다'),
        onError: () => toast.error('삭제 중 오류가 발생했습니다'),
      });
    }
  };

  const sortedExams = [...(exams || [])].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">시험 일정</h2>
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          + 추가
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">로딩 중...</div>
      ) : sortedExams.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          등록된 시험 일정이 없습니다
        </div>
      ) : (
        <div className="space-y-2">
          {sortedExams.map((exam) => {
            const days = getDaysUntil(exam.exam_date);
            return (
              <div
                key={exam.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{exam.title}</p>
                    {exam.subject && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">{exam.subject}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(exam.exam_date)}
                    {exam.exam_time && ` ${exam.exam_time}`}
                    {exam.location && ` • ${exam.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <ExamBadge days={days} />
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setForm(defaultForm); setErrors({}); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>시험 일정 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="exam-title">시험 이름 *</Label>
              <Input
                id="exam-title"
                placeholder="예: 중간고사, 기말시험"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">과목 (선택)</Label>
              <Input
                id="subject"
                placeholder="예: 수학, 영어"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exam-date">시험 날짜 *</Label>
              <Input
                id="exam-date"
                type="date"
                value={form.exam_date}
                onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                className={errors.exam_date ? 'border-red-500' : ''}
              />
              {errors.exam_date && <p className="text-red-500 text-xs">{errors.exam_date}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="exam-time">시험 시간 (선택)</Label>
                <Input
                  id="exam-time"
                  type="time"
                  value={form.exam_time}
                  onChange={(e) => setForm({ ...form, exam_time: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam-location">장소 (선택)</Label>
                <Input
                  id="exam-location"
                  placeholder="시험 장소"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={createExam.isPending}>
                {createExam.isPending ? '저장 중...' : '추가'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
