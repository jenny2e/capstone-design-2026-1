'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import MaterialIcon from '@/components/common/MaterialIcon';

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

  return (
    <>
      <style>{`
        .hide-mobile { display: none; }
        @media (min-width: 640px) { .hide-mobile { display: inline; } }
      `}</style>
      <div className="flex flex-col h-screen" style={{ background: 'var(--skema-surface)' }}>
        {/* Header */}
        <header style={{
          height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', borderBottom: '1px solid var(--skema-container)',
          background: '#fff', position: 'sticky', top: 0, zIndex: 30, flexShrink: 0
        }}>
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'var(--skema-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialIcon icon="schedule" size={15} color="#fff" filled />
            </div>
            <span className="skema-headline" style={{ fontWeight: 800, fontSize: '18px', color: 'var(--skema-on-surface)' }}>SKEMA</span>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Add button: icon + text */}
            <button onClick={() => openClassForm()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--skema-primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '7px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              <MaterialIcon icon="add" size={16} color="#fff" />
              수업 추가
            </button>

            {/* AI Chat toggle */}
            <button
              onClick={toggleChat}
              title="AI 채팅"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: isChatOpen ? 'var(--skema-secondary-container)' : 'var(--skema-surface-low)', border: 'none', borderRadius: '10px', padding: '7px 12px', fontSize: '13px', fontWeight: 600, color: isChatOpen ? 'var(--skema-primary)' : 'var(--skema-on-surface-variant)', cursor: 'pointer' }}
            >
              <MaterialIcon icon="smart_toy" size={16} color={isChatOpen ? 'var(--skema-primary)' : 'var(--skema-on-surface-variant)'} filled={isChatOpen} />
              <span className="hide-mobile">AI</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              title="공유"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--skema-surface-low)', border: 'none', borderRadius: '10px', padding: '7px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--skema-on-surface-variant)', cursor: 'pointer' }}
            >
              <MaterialIcon icon="share" size={16} color="var(--skema-on-surface-variant)" />
              <span className="hide-mobile">공유</span>
            </button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full transition-all outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs font-bold" style={{ background: 'var(--skema-secondary-container)', color: 'var(--skema-primary)' }}>
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
                    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--skema-secondary-container)', borderTopColor: 'transparent' }} />
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
                  <div className="w-6 h-6 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--skema-secondary-container)', borderTopColor: 'transparent' }} />
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
                    <Button size="sm" onClick={copyShareUrl} className="flex-shrink-0" style={{ background: 'var(--skema-primary)', color: '#fff' }}>
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
    </>
  );
}
