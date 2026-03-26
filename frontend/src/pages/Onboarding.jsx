import { useState } from 'react';
import { createExam, updateProfile } from '../services/api';

const OCCUPATIONS = ['대학생', '대학원생', '직장인', '취준생', '프리랜서', '기타'];

const STEPS = [
  { id: 'occupation', title: '직업을 알려주세요', subtitle: '맞춤 일정 관리를 위해 직업 정보가 필요합니다', icon: 'badge' },
  { id: 'sleep', title: '수면 시간을 설정해주세요', subtitle: 'AI가 학습 일정 생성 시 수면 시간을 제외합니다', icon: 'bedtime' },
  { id: 'exam', title: '시험 일정을 입력해주세요', subtitle: 'AI가 시험에 맞춰 학습 계획을 세웁니다 (선택사항)', icon: 'edit_calendar' },
  { id: 'done', title: '설정 완료!', subtitle: 'SKEMA를 시작할 준비가 되었습니다', icon: 'task_alt' },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [occupation, setOccupation] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');
  const [exams, setExams] = useState([]);
  const [examForm, setExamForm] = useState({ title: '', subject: '', exam_date: '', exam_time: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const current = STEPS[step];

  const handleNext = async () => {
    setError('');
    if (step === 0 && !occupation && !customOccupation) {
      setError('직업을 선택하거나 입력해주세요.');
      return;
    }
    if (step === 2) {
      setSaving(true);
      try {
        await updateProfile({
          occupation: occupation === '기타' ? customOccupation : occupation,
          sleep_start: sleepStart,
          sleep_end: sleepEnd,
          onboarding_completed: true,
        });
        for (const exam of exams) {
          await createExam(exam);
        }
      } catch {
        setError('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
        setSaving(false);
        return;
      } finally {
        setSaving(false);
      }
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleSkipAndFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        occupation: occupation === '기타' ? customOccupation : occupation,
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
        onboarding_completed: true,
      });
    } catch {
      // Proceed anyway
    } finally {
      setSaving(false);
    }
    onComplete();
  };

  const addExam = () => {
    if (!examForm.title || !examForm.exam_date) {
      setError('시험명과 날짜를 입력해주세요.');
      return;
    }
    setExams((prev) => [...prev, { ...examForm }]);
    setExamForm({ title: '', subject: '', exam_date: '', exam_time: '' });
    setError('');
  };

  const removeExam = (i) => setExams((prev) => prev.filter((_, idx) => idx !== i));

  const inp = {
    width: '100%',
    padding: '13px 16px',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    background: '#e5e8eb',
    color: '#181c1e',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'box-shadow 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#434653',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 7,
    marginLeft: 2,
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>
      {/* Blur orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: 350, height: 350, background: '#3b66cc', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 250, height: 250, background: '#c3d0ff', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, pointerEvents: 'none' }} />

      {/* Brand */}
      <div style={{ marginBottom: 24, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: '#181c1e', letterSpacing: '-0.2px' }}>SKEMA</div>
        <div style={{ fontSize: 12, color: '#747684', marginTop: 2 }}>초기 설정</div>
      </div>

      <div className="login-card" style={{
        background: '#fff',
        borderRadius: 20,
        padding: '40px 38px',
        width: 480,
        maxWidth: '100%',
        boxShadow: '0 20px 40px rgba(24,28,30,0.08), 0 2px 8px rgba(24,28,30,0.04)',
        border: '1px solid rgba(195,198,213,0.15)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? '#1a4db2' : '#e5e8eb', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Step icon + header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#ebeef1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 24 }}>{current.icon}</span>
          </div>
          <div>
            <h2 style={{ margin: '0 0 3px', fontSize: 20, fontWeight: 800, color: '#181c1e', fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.2px' }}>
              {current.title}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#434653', lineHeight: 1.5 }}>{current.subtitle}</p>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '11px 14px', background: '#ffdad6', borderRadius: 10, color: '#ba1a1a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
            {error}
          </div>
        )}

        {/* Step 0: Occupation */}
        {step === 0 && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {OCCUPATIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccupation(o)}
                  style={{
                    padding: '9px 18px',
                    border: `1.5px solid ${occupation === o ? '#1a4db2' : '#e5e8eb'}`,
                    borderRadius: 9999,
                    cursor: 'pointer',
                    background: occupation === o ? '#1a4db2' : '#fff',
                    color: occupation === o ? '#fff' : '#181c1e',
                    fontSize: 14,
                    fontWeight: occupation === o ? 700 : 400,
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.15s',
                    boxShadow: occupation === o ? '0 4px 12px rgba(26,77,178,0.2)' : 'none',
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
            {occupation === '기타' && (
              <input value={customOccupation} onChange={(e) => setCustomOccupation(e.target.value)} placeholder="직업을 직접 입력해주세요" style={{ ...inp, marginTop: 8 }} />
            )}
          </div>
        )}

        {/* Step 1: Sleep */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>취침 시간</label>
              <input type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={labelStyle}>기상 시간</label>
              <input type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} style={inp} />
            </div>
          </div>
        )}

        {/* Step 2: Exams */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <input value={examForm.title} onChange={(e) => setExamForm((f) => ({ ...f, title: e.target.value }))} placeholder="시험명 (예: 중간고사)" style={inp} />
              </div>
              <input value={examForm.subject} onChange={(e) => setExamForm((f) => ({ ...f, subject: e.target.value }))} placeholder="과목 (선택)" style={inp} />
              <input type="date" value={examForm.exam_date} onChange={(e) => setExamForm((f) => ({ ...f, exam_date: e.target.value }))} style={inp} />
            </div>
            <button type="button" onClick={addExam} className="btn-primary" style={{ marginBottom: 14 }}>
              + 시험 추가
            </button>
            {exams.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {exams.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f1f4f7', borderRadius: 12, border: '1px solid rgba(195,198,213,0.2)' }}>
                    <span style={{ fontSize: 13, color: '#181c1e' }}>{e.title}{e.subject ? ` (${e.subject})` : ''} — {e.exam_date}</span>
                    <button onClick={() => removeExam(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', fontSize: 18, padding: '0 4px' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#dae1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 38, fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <p style={{ color: '#181c1e', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              프로필 설정이 완료되었습니다!<br />
              AI가 맞춤 일정을 도와드릴게요.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 28 }}>
          {step < 3 && (
            <button
              type="button"
              onClick={handleSkipAndFinish}
              disabled={saving}
              style={{ padding: '11px 22px', border: '1.5px solid #e5e8eb', borderRadius: 9999, cursor: 'pointer', background: '#fff', color: '#1a4db2', fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", transition: 'background 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f4f7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              건너뛰기
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              style={{
                padding: '11px 28px',
                background: saving ? '#b3c5ff' : '#1a4db2',
                color: '#fff', border: 'none', borderRadius: 9999,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 700,
                boxShadow: '0 8px 24px rgba(26,77,178,0.25)',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.1)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
            >
              {saving ? '저장 중...' : step === 2 ? '완료' : '다음'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              style={{ padding: '11px 28px', background: '#1a4db2', color: '#fff', border: 'none', borderRadius: 9999, cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(26,77,178,0.25)', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
            >
              시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
