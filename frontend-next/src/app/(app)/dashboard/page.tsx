'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timetable } from '@/components/timetable/Timetable';
import { ClassForm } from '@/components/class-form/ClassForm';
import { AIChat } from '@/components/ai-chat/AIChat';
import { ExamList } from '@/components/exam/ExamList';
import { useSchedules } from '@/hooks/useSchedules';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isChatOpen, toggleChat, openClassForm, isShareModalOpen, openShareModal, closeShareModal } = useUIStore();
  const { data: schedules = [], isLoading } = useSchedules();
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('로그아웃 되었습니다');
  };

  const handleShare = async () => {
    openShareModal();
    if (shareToken) return;
    setIsGeneratingShare(true);
    try {
      const { data } = await api.post<{ token: string }>('/share');
      setShareToken(data.token);
    } catch {
      toast.error('공유 링크 생성 중 오류가 발생했습니다');
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const shareUrl = shareToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareToken}`
    : '';

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('링크가 복사되었습니다');
    }
  };

  const completedCount = schedules.filter((s) => s.is_completed).length;
  const totalCount = schedules.length;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b px-4 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">시</span>
          </div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
            스마트 시간표
          </h1>
          {totalCount > 0 && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {completedCount}/{totalCount} 완료
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => openClassForm()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            + 추가
          </Button>
          <Button
            size="sm"
            variant={isChatOpen ? 'default' : 'outline'}
            onClick={toggleChat}
            className={isChatOpen ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            🤖 AI
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare}>
            공유
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:ring-2 ring-indigo-300 transition-all outline-none">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <p className="font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-500 font-normal">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/onboarding')}>
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Timetable + Exams */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="timetable">
            <TabsList className="mb-4">
              <TabsTrigger value="timetable">시간표</TabsTrigger>
              <TabsTrigger value="exams">시험 일정</TabsTrigger>
            </TabsList>
            <TabsContent value="timetable">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <Timetable schedules={schedules} />
              )}
            </TabsContent>
            <TabsContent value="exams">
              <ExamList />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: AI Chat Sidebar */}
        {isChatOpen && (
          <div className="w-80 flex-shrink-0 overflow-hidden border-l">
            <AIChat onClose={toggleChat} />
          </div>
        )}
      </div>

      {/* Class Form Dialog */}
      <ClassForm />

      {/* Share Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={(open) => !open && closeShareModal()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>시간표 공유</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isGeneratingShare ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : shareUrl ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  아래 링크를 공유하면 누구나 내 시간표를 볼 수 있습니다.
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 text-xs border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                  <Button size="sm" onClick={copyShareUrl} className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0">
                    복사
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">공유 링크를 생성할 수 없습니다.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeShareModal}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
