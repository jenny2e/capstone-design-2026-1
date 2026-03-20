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
    const todayDow = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon
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
  const { schedules, loading, error, fetchSchedules, addSchedule, editSchedule, removeSchedule } =
    useSchedule();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [addHovered, setAddHovered] = useState(false);
  const [shareHovered, setShareHovered] = useState(false);
  const [chatHovered, setChatHovered] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF' }}>
      {/* In-app notification toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            right: 20,
            zIndex: 300,
            background: 'white',
            border: '1px solid #E4E1F7',
            borderLeft: '4px solid #6366F1',
            borderRadius: 12,
            padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
            maxWidth: 300,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 20 }}>🔔</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1E1B4B' }}>곧 시작!</div>
            <div style={{ fontSize: 12, color: '#7C73C0', marginTop: 2 }}>
              {notification.title} — {notification.start_time}
            </div>
          </div>
          <button
            onClick={dismiss}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C4B5FD', fontSize: 16, padding: 0, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #7C3AED 100%)',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 4px 24px rgba(55,48,163,0.35)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, backdropFilter: 'blur(4px)',
          }}>📅</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'white', lineHeight: 1.1 }}>AI 시간표</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>Smart Schedule Manager</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            padding: '4px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 20,
            fontSize: 12, color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)',
          }}>
            👤 {user?.username}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '6px 13px',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            ⚙️ 설정
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '6px 13px',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setShowForm(true)}
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: 13, boxShadow: addHovered ? '0 6px 20px rgba(99,102,241,0.5)' : '0 3px 10px rgba(99,102,241,0.35)',
              transform: addHovered ? 'translateY(-2px)' : 'none',
              transition: 'box-shadow 0.2s, transform 0.2s', fontFamily: 'inherit',
            }}
          >
            ＋ 강의 추가
          </button>
          <button
            onClick={handleShare}
            onMouseEnter={() => setShareHovered(true)}
            onMouseLeave={() => setShareHovered(false)}
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #059669, #10B981)',
              color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              boxShadow: shareHovered ? '0 6px 20px rgba(16,185,129,0.5)' : '0 3px 10px rgba(16,185,129,0.3)',
              transform: shareHovered ? 'translateY(-2px)' : 'none',
              transition: 'box-shadow 0.2s, transform 0.2s', fontFamily: 'inherit',
            }}
          >
            🔗 공유 링크
          </button>
          <button
            onClick={() => setShowChat((v) => !v)}
            onMouseEnter={() => setChatHovered(true)}
            onMouseLeave={() => setChatHovered(false)}
            style={{
              padding: '9px 18px',
              background: showChat ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'white',
              color: showChat ? 'white' : '#7C3AED',
              border: showChat ? 'none' : '1.5px solid #DDD6FE',
              borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              boxShadow: chatHovered ? '0 6px 20px rgba(124,58,237,0.35)' : showChat ? '0 3px 10px rgba(124,58,237,0.3)' : 'none',
              transform: chatHovered ? 'translateY(-2px)' : 'none',
              transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s', fontFamily: 'inherit',
            }}
          >
            🤖 AI {showChat ? '닫기' : '열기'}
          </button>

          {shareUrl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 8, maxWidth: 420 }}>
              <a href={shareUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#059669', wordBreak: 'break-all', textDecoration: 'none' }}>
                {shareUrl}
              </a>
              <button
                onClick={handleCopy}
                style={{ padding: '3px 10px', fontSize: 11, border: '1px solid #6EE7B7', borderRadius: 4, cursor: 'pointer', background: 'white', color: '#059669', flexShrink: 0, fontFamily: 'inherit' }}
              >
                {copied ? '✓ 복사됨' : '복사'}
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {(showForm || editTarget) && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(30,27,75,0.5)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 100,
            }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', width: 420, maxWidth: '92vw', boxShadow: '0 20px 60px rgba(79,70,229,0.25)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 17, color: '#1E1B4B', fontWeight: 700 }}>
                {editTarget ? '강의 수정' : '강의 추가'}
              </h3>
              <ClassForm
                initial={editTarget}
                onSubmit={editTarget ? handleEdit : handleAdd}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <Settings
            profile={profile}
            onClose={() => setShowSettings(false)}
            onProfileUpdate={onProfileUpdate}
          />
        )}

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: showChat ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
          {/* Timetable */}
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #EDE9FE', overflow: 'hidden', boxShadow: '0 8px 32px rgba(99,102,241,0.1), 0 1px 4px rgba(0,0,0,0.05)' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#7C73C0' }}>불러오는 중...</div>
            ) : error ? (
              <div style={{ padding: 24, color: '#EF4444', fontSize: 14 }}>{error}</div>
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
