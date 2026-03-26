'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

const OCCUPATIONS = ['학생', '직장인', '프리랜서', '기타'];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [profileForm, setProfileForm] = useState({
    occupation: '',
    sleep_start: '23:00',
    sleep_end: '07:00',
  });

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifMinutes, setNotifMinutes] = useState(30);

  // Sync profile data when loaded
  useEffect(() => {
    if (profile) {
      setProfileForm({
        occupation: profile.occupation || '',
        sleep_start: profile.sleep_start || '23:00',
        sleep_end: profile.sleep_end || '07:00',
      });
    }
  }, [profile]);

  // Load notification settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotifEnabled(localStorage.getItem('skema_notif_enabled') !== 'false');
      setNotifMinutes(parseInt(localStorage.getItem('skema_notif_minutes') || '30', 10));
    }
  }, [open]);

  const handleSaveProfile = () => {
    updateProfile.mutate(profileForm, {
      onSuccess: () => {
        toast.success('프로필이 저장되었습니다');
        onClose();
      },
      onError: () => toast.error('저장 중 오류가 발생했습니다'),
    });
  };

  const handleSaveNotif = () => {
    localStorage.setItem('skema_notif_enabled', String(notifEnabled));
    localStorage.setItem('skema_notif_minutes', String(notifMinutes));
    toast.success('알림 설정이 저장되었습니다');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="profile" className="flex-1">프로필</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">알림</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-5">
            <div className="space-y-2">
              <Label>직업 / 신분</Label>
              <div className="grid grid-cols-2 gap-2">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, occupation: occ })}
                    className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      profileForm.occupation === occ
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
              {profileForm.occupation === '기타' && (
                <Input
                  placeholder="직접 입력"
                  value=""
                  onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-sleep-start">취침 시간</Label>
                <Input
                  id="s-sleep-start"
                  type="time"
                  value={profileForm.sleep_start}
                  onChange={(e) => setProfileForm({ ...profileForm, sleep_start: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-sleep-end">기상 시간</Label>
                <Input
                  id="s-sleep-end"
                  type="time"
                  value={profileForm.sleep_end}
                  onChange={(e) => setProfileForm({ ...profileForm, sleep_end: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>취소</Button>
              <Button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                style={{ background: 'var(--skema-primary)', color: '#fff' }}
              >
                {updateProfile.isPending ? '저장 중...' : '저장'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">알림 활성화</p>
                <p className="text-xs text-gray-500 mt-0.5">일정 시작 전 알림을 받습니다</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifEnabled(!notifEnabled)}
                style={{
                  width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: notifEnabled ? 'var(--skema-primary)' : '#d1d5db',
                  position: 'relative', transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: notifEnabled ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>

            {notifEnabled && (
              <div className="space-y-2">
                <Label>알림 시간 (분 전)</Label>
                <div className="flex gap-2 flex-wrap">
                  {[10, 15, 30, 60].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setNotifMinutes(min)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        notifMinutes === min
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {min}분
                    </button>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>취소</Button>
              <Button
                onClick={handleSaveNotif}
                style={{ background: 'var(--skema-primary)', color: '#fff' }}
              >
                저장
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
