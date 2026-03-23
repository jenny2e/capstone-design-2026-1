import { useEffect, useState } from 'react';
import AIChat from '../components/AIChat/AIChat';
import ClassForm from '../components/ClassForm/ClassForm';
import Timetable from '../components/Timetable/Timetable';
import { useSchedule } from '../hooks/useSchedule';
import { createShareLink } from '../services/api';
import Settings from './Settings';

function useNotifications(schedules) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!schedules.length) return;
    const now = new Date();
    const todayDow = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const todayStr = now.toISOString().slice(0, 10);

    const upcoming = schedules.find((s) => {
      const sDow = s.date ? (new Date(s.date).getDay() === 0 ? 6 : new Date(s.date).getDay() - 1) : s.day_of_week;
      const matchDay = s.date ? s.date === todayStr : sDow === todayDow;
      if (!matchDay) return false;
      const [sh, sm] = s.start_time.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const diff = startMin - nowMin;
      return diff > 0 && diff <= 30;
    });

    if (upcoming && !notification) {
      setNotification(upcoming);
      const timer = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [schedules]);

  return { notification, dismiss: () => setNotification(null) };
}

export default function Home({ user, profile, onLogout, onProfileUpdate }) {
  const { schedules, loading, error, fetchSchedules, addSchedule, editSchedule, removeSchedule } = useSchedule();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { notification, dismiss } = useNotifications(schedules);

  const handleAdd = async (data) => {
    await addSchedule(data);
    setShowForm(false);
  };

  const handleEdit = async (data) => {
    await editSchedule(editTarget.id, data);
    setEditTarget(null);
  };

  const handleShare = async () => {
    try {
      const res = await createShareLink();
      setShareUrl(res.data.share_url);
    } catch {
      alert('공유 링크 생성에 실패했습니다.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd' }}>
      {/* Notification toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 72, right: 20, zIndex: 300,
          background: '#fff',
          border: '1px solid rgba(195,198,213,0.2)',
          borderLeft: '4px solid #1a4db2',
          borderRadius: 16,
          padding: '14px 18px',
          boxShadow: '0 8px 32px rgba(24,28,30,0.12)',
          maxWidth: 300,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dae1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 20 }}>notifications_active</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#181c1e', fontFamily: "'Manrope', sans-serif" }}>곧 시작!</div>
            <div style={{ fontSize: 12, color: '#434653', marginTop: 2 }}>
              {notification.title} — {notification.start_time}
            </div>
          </div>
          <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#747684', fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Header */}
      <header style={{
        background: 'rgba(247,250,253,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid rgba(195,198,213,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>calendar_month</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, color: '#181c1e', lineHeight: 1.1, letterSpacing: '-0.2px' }}>SKEMA</div>
            <div style={{ fontSize: 10, color: '#747684', fontWeight: 500 }}>Smart Schedule Manager</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: '5px 12px', background: '#ebeef1', borderRadius: 9999, fontSize: 12, color: '#434653', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
            {user?.username}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{ padding: '6px 14px', border: '1px solid rgba(195,198,213,0.4)', borderRadius: 9999, cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#fff', color: '#434653', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>settings</span>
            설정
          </button>
          <button
            onClick={onLogout}
            style={{ padding: '6px 14px', border: '1px solid rgba(195,198,213,0.4)', borderRadius: 9999, cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#fff', color: '#434653', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px' }}>
        {/* Page header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, color: '#181c1e', margin: 0, letterSpacing: '-0.3px' }}>내 시간표</h1>
            <p style={{ fontSize: 13, color: '#747684', margin: '2px 0 0', fontFamily: "'Inter', sans-serif" }}>{dateStr}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              강의 추가
            </button>
            <button
              className="btn-secondary"
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>link</span>
              공유 링크
            </button>
            <button
              className={showChat ? 'btn-ai-close' : 'btn-ai-open'}
              onClick={() => setShowChat((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>smart_toy</span>
              AI {showChat ? '닫기' : '열기'}
            </button>

            {shareUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: '#fff', border: '1px solid rgba(195,198,213,0.4)', borderRadius: 9999, maxWidth: 360 }}>
                <a href={shareUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#1a4db2', wordBreak: 'break-all', textDecoration: 'none' }}>
                  {shareUrl}
                </a>
                <button
                  onClick={handleCopy}
                  style={{ padding: '3px 10px', fontSize: 11, border: '1px solid #e5e8eb', borderRadius: 9999, cursor: 'pointer', background: '#ebeef1', color: '#434653', flexShrink: 0, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  {copied ? '✓ 복사됨' : '복사'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(showForm || editTarget) && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(24,28,30,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', width: 420, maxWidth: '92vw', boxShadow: '0 20px 40px rgba(24,28,30,0.12)', border: '1px solid rgba(195,198,213,0.15)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#181c1e', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.2px' }}>
                {editTarget ? '강의 수정' : '강의 추가'}
              </h3>
              <ClassForm initial={editTarget} onSubmit={editTarget ? handleEdit : handleAdd} onCancel={closeModal} />
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <Settings profile={profile} onClose={() => setShowSettings(false)} onProfileUpdate={onProfileUpdate} />
        )}

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: showChat ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
          {/* Timetable */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(195,198,213,0.2)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(24,28,30,0.06)' }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#747684', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <span className="material-symbols-outlined" style={{ color: '#b3c5ff', fontSize: 36 }}>calendar_month</span>
                불러오는 중...
              </div>
            ) : error ? (
              <div style={{ padding: 24, color: '#ba1a1a', fontSize: 14 }}>{error}</div>
            ) : (
              <Timetable schedules={schedules} onDelete={removeSchedule} onEdit={setEditTarget} />
            )}
          </div>

          {/* AI Chat */}
          {showChat && (
            <div style={{ height: 680, position: 'sticky', top: 80 }}>
              <AIChat onScheduleChange={fetchSchedules} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
