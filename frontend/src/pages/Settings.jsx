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
      const res = await updateProfile({ occupation: isCustom ? occupation : occupation, sleep_start: sleepStart, sleep_end: sleepEnd });
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
    if (!examForm.title || !examForm.exam_date) { setError('시험명과 날짜를 입력해주세요.'); return; }
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
    width: '100%', padding: '12px 14px', border: 'none', borderRadius: 12,
    fontSize: 14, outline: 'none', background: '#e5e8eb', color: '#181c1e',
    fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#434653',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7,
    marginLeft: 2, fontFamily: "'Inter', sans-serif",
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(24,28,30,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: 500, maxWidth: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(24,28,30,0.12)', border: '1px solid rgba(195,198,213,0.15)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(195,198,213,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#ebeef1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 20 }}>settings</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#181c1e', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.2px' }}>설정</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#ebeef1', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#434653', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e8eb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
          >×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(195,198,213,0.2)' }}>
          {[['profile', 'person', '프로필'], ['exams', 'edit_calendar', '시험 일정']].map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{ flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer', background: '#fff', color: activeTab === id ? '#1a4db2' : '#747684', fontWeight: activeTab === id ? 700 : 500, fontSize: 13, borderBottom: activeTab === id ? '2px solid #1a4db2' : '2px solid transparent', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {error && (
            <div style={{ marginBottom: 16, padding: '11px 14px', background: '#ffdad6', borderRadius: 10, color: '#ba1a1a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
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
                      style={{ padding: '7px 16px', border: `1.5px solid ${occupation === o ? '#1a4db2' : '#e5e8eb'}`, borderRadius: 9999, cursor: 'pointer', background: occupation === o ? '#1a4db2' : '#fff', color: occupation === o ? '#fff' : '#181c1e', fontSize: 13, fontWeight: occupation === o ? 700 : 400, fontFamily: "'Inter', sans-serif", transition: 'all 0.15s', boxShadow: occupation === o ? '0 4px 12px rgba(26,77,178,0.2)' : 'none' }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {isCustom && <input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="직업을 직접 입력" style={inp} />}
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
                style={{ width: '100%', padding: '13px 0', background: saved ? '#059669' : saving ? '#b3c5ff' : '#1a4db2', color: '#fff', border: 'none', borderRadius: 9999, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, boxShadow: saving || saved ? 'none' : '0 8px 24px rgba(26,77,178,0.25)', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.1)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
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
                <button onClick={handleAddExam} className="btn-primary">+ 추가</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {exams.length === 0 ? (
                  <p style={{ color: '#747684', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>등록된 시험 일정이 없습니다.</p>
                ) : (
                  exams.map((e) => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f1f4f7', borderRadius: 12, border: '1px solid rgba(195,198,213,0.2)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#181c1e' }}>{e.title}</div>
                        <div style={{ fontSize: 12, color: '#434653' }}>{e.subject ? `${e.subject} · ` : ''}{e.exam_date}</div>
                      </div>
                      <button onClick={() => handleDeleteExam(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', fontSize: 18, padding: '0 4px' }}>×</button>
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
