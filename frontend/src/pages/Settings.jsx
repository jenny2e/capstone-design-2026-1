import { useEffect, useState } from 'react';
import { createExam, deleteExam, getExams, updateProfile } from '../services/api';

const OCCUPATIONS = ['대학생', '대학원생', '직장인', '취준생', '프리랜서', '기타'];

export default function Settings({ profile: initialProfile, onClose, onProfileUpdate }) {
  const [occupation, setOccupation] = useState(initialProfile?.occupation || '');
  const [isCustom, setIsCustom] = useState(!OCCUPATIONS.includes(initialProfile?.occupation || ''));
  const [sleepStart, setSleepStart] = useState(initialProfile?.sleep_start || '23:00');
  const [sleepEnd, setSleepEnd] = useState(initialProfile?.sleep_end || '07:00');
  const [exams, setExams] = useState([]);
  const [examForm, setExamForm] = useState({ title: '', subject: '', exam_date: '', exam_time: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    getExams().then((r) => setExams(r.data)).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await updateProfile({
        occupation: isCustom ? occupation : (OCCUPATIONS.includes(occupation) ? occupation : occupation),
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
      });
      onProfileUpdate?.(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExam = async () => {
    if (!examForm.title || !examForm.exam_date) {
      setError('시험명과 날짜를 입력해주세요.');
      return;
    }
    setError('');
    try {
      const res = await createExam(examForm);
      setExams((prev) => [...prev, res.data]);
      setExamForm({ title: '', subject: '', exam_date: '', exam_time: '' });
    } catch {
      setError('시험 일정 추가에 실패했습니다.');
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('삭제에 실패했습니다.');
    }
  };

  const inp = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E4E1F7',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    background: '#FAFAFF',
    color: '#1E1B4B',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,27,75,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          width: 500,
          maxWidth: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(79,70,229,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #4F46E5, #6366F1, #7C3AED)',
            backgroundImage: 'linear-gradient(135deg, #4F46E5, #6366F1, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>⚙️ 설정</span>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E4E1F7' }}>
          {[['profile', '👤 프로필'], ['exams', '📝 시험 일정']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                padding: '12px 0',
                border: 'none',
                cursor: 'pointer',
                background: 'white',
                color: activeTab === id ? '#6366F1' : '#7C73C0',
                fontWeight: activeTab === id ? 700 : 400,
                fontSize: 13,
                borderBottom: activeTab === id ? '2px solid #6366F1' : '2px solid transparent',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>직업</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {OCCUPATIONS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => { setOccupation(o); setIsCustom(o === '기타'); }}
                      style={{
                        padding: '7px 14px',
                        border: `1.5px solid ${occupation === o ? '#6366F1' : '#E4E1F7'}`,
                        borderRadius: 20,
                        cursor: 'pointer',
                        background: occupation === o ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'white',
                        backgroundImage: occupation === o ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'none',
                        color: occupation === o ? 'white' : '#1E1B4B',
                        fontSize: 13,
                        fontWeight: occupation === o ? 600 : 400,
                        fontFamily: 'inherit',
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {isCustom && (
                  <input
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="직업을 직접 입력"
                    style={inp}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>취침 시간</label>
                  <input type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={labelStyle}>기상 시간</label>
                  <input type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} style={inp} />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: saved ? 'linear-gradient(135deg, #059669, #10B981)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  backgroundImage: saved ? 'linear-gradient(135deg, #059669, #10B981)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s',
                }}
              >
                {saving ? '저장 중...' : saved ? '✓ 저장됨' : '저장'}
              </button>
            </div>
          )}

          {activeTab === 'exams' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>시험명</label>
                    <input value={examForm.title} onChange={(e) => setExamForm((f) => ({ ...f, title: e.target.value }))} placeholder="예: 중간고사" style={inp} />
                  </div>
                  <div>
                    <label style={labelStyle}>과목 (선택)</label>
                    <input value={examForm.subject} onChange={(e) => setExamForm((f) => ({ ...f, subject: e.target.value }))} placeholder="예: 알고리즘" style={inp} />
                  </div>
                  <div>
                    <label style={labelStyle}>시험 날짜</label>
                    <input type="date" value={examForm.exam_date} onChange={(e) => setExamForm((f) => ({ ...f, exam_date: e.target.value }))} style={inp} />
                  </div>
                </div>
                <button
                  onClick={handleAddExam}
                  style={{
                    padding: '8px 18px',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                  }}
                >
                  + 추가
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {exams.length === 0 ? (
                  <p style={{ color: '#7C73C0', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                    등록된 시험 일정이 없습니다.
                  </p>
                ) : (
                  exams.map((e) => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F5F3FF', borderRadius: 10, border: '1px solid #E4E1F7' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1E1B4B' }}>{e.title}</div>
                        <div style={{ fontSize: 12, color: '#7C73C0' }}>{e.subject ? `${e.subject} · ` : ''}{e.exam_date}</div>
                      </div>
                      <button onClick={() => handleDeleteExam(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 18, padding: '0 4px' }}>
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
