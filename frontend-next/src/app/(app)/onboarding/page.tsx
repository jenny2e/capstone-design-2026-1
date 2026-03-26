'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useCreateExam } from '@/hooks/useExams';

const OCCUPATIONS = ['학생', '직장인', '프리랜서', '기타'];

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useUpdateProfile();
  const createExam = useCreateExam();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    occupation: '',
    sleep_start: '23:00',
    sleep_end: '07:00',
  });
  const [examForm, setExamForm] = useState({ title: '', exam_date: '' });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = () => {
    updateProfile.mutate(
      { ...form, onboarding_completed: true },
      {
        onSuccess: () => {
          toast.success('설정이 완료되었습니다! 시간표를 시작해보세요');
          router.push('/dashboard');
        },
        onError: () => {
          toast.error('설정 저장 중 오류가 발생했습니다');
        },
      }
    );
  };

  const handleFinishWithExam = () => {
    if (examForm.title && examForm.exam_date) {
      createExam.mutate(
        { title: examForm.title, exam_date: examForm.exam_date },
        { onSettled: () => handleSubmit() }
      );
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    updateProfile.mutate(
      { onboarding_completed: true },
      {
        onSuccess: () => router.push('/dashboard'),
        onError: () => router.push('/dashboard'),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className="flex-1 h-1 my-auto bg-gray-200 rounded">
              <div className={`h-full bg-indigo-600 rounded transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className="flex-1 h-1 my-auto bg-gray-200 rounded">
              <div className={`h-full bg-indigo-600 rounded transition-all ${step >= 3 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          </div>
          {step === 1 && (
            <>
              <CardTitle className="text-2xl font-bold">프로필 설정</CardTitle>
              <CardDescription>기본 정보를 입력해주세요</CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="text-2xl font-bold">수면 시간 설정</CardTitle>
              <CardDescription>AI가 일정 추천 시 참고합니다</CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="text-2xl font-bold">시험 일정 등록</CardTitle>
              <CardDescription>가까운 시험을 등록해두세요 (선택)</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>직업 / 신분</Label>
                <div className="grid grid-cols-2 gap-2">
                  {OCCUPATIONS.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setForm({ ...form, occupation: occ })}
                      className={`py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.occupation === occ
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
              {form.occupation === '기타' && (
                <div className="space-y-2">
                  <Label htmlFor="customOccupation">직접 입력</Label>
                  <Input
                    id="customOccupation"
                    placeholder="직업 / 신분을 입력하세요"
                    value={form.occupation === '기타' ? '' : form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={handleSkip}>
                  건너뛰기
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleNext}>
                  다음
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sleep_start">취침 시간</Label>
                  <Input
                    id="sleep_start"
                    type="time"
                    value={form.sleep_start}
                    onChange={(e) => setForm({ ...form, sleep_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleep_end">기상 시간</Label>
                  <Input
                    id="sleep_end"
                    type="time"
                    value={form.sleep_end}
                    onChange={(e) => setForm({ ...form, sleep_end: e.target.value })}
                  />
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-sm text-indigo-700 dark:text-indigo-300">
                💡 수면 시간 설정을 통해 AI가 더 적합한 시간에 일정을 추천해드립니다.
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={handleSkip}>
                  건너뛰기
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  이전
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleNext}
                  disabled={updateProfile.isPending}
                >
                  다음
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam_title">시험 이름</Label>
                <Input
                  id="exam_title"
                  placeholder="예: 중간고사, 기말시험"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam_date">시험 날짜</Label>
                <Input
                  id="exam_date"
                  type="date"
                  value={examForm.exam_date}
                  onChange={(e) => setExamForm({ ...examForm, exam_date: e.target.value })}
                />
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-sm text-indigo-700 dark:text-indigo-300">
                💡 나중에 대시보드에서 시험 일정을 추가하거나 수정할 수 있습니다.
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={handleSubmit} disabled={updateProfile.isPending}>
                  건너뛰기
                </Button>
                <Button variant="outline" onClick={() => setStep(2)}>
                  이전
                </Button>
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleFinishWithExam}
                  disabled={updateProfile.isPending || createExam.isPending}
                >
                  {updateProfile.isPending || createExam.isPending ? '저장 중...' : '시작하기'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
