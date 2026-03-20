import { useState } from 'react';
import { createExam, updateProfile } from '../services/api';

const OCCUPATIONS = ['대학생', '대학원생', '직장인', '취준생', '프리랜서', '기타'];

const STEPS = [
  { id: 'occupation', title: '직업을 알려주세요', subtitle: '맞춤 일정 관리를 위해 직업 정보가 필요합니다' },
  { id: 'sleep', title: '수면 시간을 설정해주세요', subtitle: 'AI가 학습 일정 생성 시 수면 시간을 제외합니다' },
  { id: 'exam', title: '시험 일정을 입력해주세요', subtitle: 'AI가 시험에 맞춰 학습 계획을 세웁니다 (선택사항)' },
  { id: 'done', title: '설정 완료!', subtitle: 'AI 시간표를 시작할 준비가 되었습니다' },
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
      // Save profile + exams
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
      } catch (e) {
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #8B5CF6, #C4B5FD)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 20,
          padding: '40px 36px',
          width: 460,
          maxWidth: '100%',
          boxShadow: '0 8px 40px rgba(79,70,229,0.25)',
        }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {STEPS.slice(0, -1).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i <= step ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#EDE9FE',
                backgroundImage: i <= step ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'none',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1E1B4B' }}>
          {current.title}
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#7C73C0' }}>{current.subtitle}</p>

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#DC2626', fontSize: 13 }}>
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
                    padding: '8px 16px',
                    border: `1.5px solid ${occupation === o ? '#6366F1' : '#E4E1F7'}`,
                    borderRadius: 20,
                    cursor: 'pointer',
                    background: occupation === o ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'white',
                    backgroundImage: occupation === o ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'none',
                    color: occupation === o ? 'white' : '#1E1B4B',
                    fontSize: 14,
                    fontWeight: occupation === o ? 600 : 400,
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
            {occupation === '기타' && (
              <input
                value={customOccupation}
                onChange={(e) => setCustomOccupation(e.target.value)}
                placeholder="직업을 직접 입력해주세요"
                style={{ ...inp, marginTop: 8 }}
              />
            )}
          </div>
        )}

        {/* Step 1: Sleep */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                취침 시간
              </label>
              <input type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                기상 시간
              </label>
              <input type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} style={inp} />
            </div>
          </div>
        )}

        {/* Step 2: Exams */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <input
                  value={examForm.title}
                  onChange={(e) => setExamForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="시험명 (예: 중간고사)"
                  style={inp}
                />
              </div>
              <input
                value={examForm.subject}
                onChange={(e) => setExamForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="과목 (선택)"
                style={inp}
              />
              <input
                type="date"
                value={examForm.exam_date}
                onChange={(e) => setExamForm((f) => ({ ...f, exam_date: e.target.value }))}
                style={inp}
              />
            </div>
            <button
              type="button"
              onClick={addExam}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                marginBottom: 14,
              }}
            >
              + 시험 추가
            </button>
            {exams.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {exams.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F5F3FF', borderRadius: 8, border: '1px solid #E4E1F7' }}>
                    <span style={{ fontSize: 13, color: '#1E1B4B' }}>
                      {e.title}{e.subject ? ` (${e.subject})` : ''} — {e.exam_date}
                    </span>
                    <button
                      onClick={() => removeExam(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 16, padding: '0 4px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <p style={{ color: '#1E1B4B', fontSize: 15, lineHeight: 1.7 }}>
              프로필 설정이 완료되었습니다!<br />
              AI가 맞춤 일정을 도와드릴게요.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 28 }}>
          {step === 2 && (
            <button
              type="button"
              onClick={handleSkipAndFinish}
              disabled={saving}
              style={{
                padding: '10px 20px',
                border: '1.5px solid #E4E1F7',
                borderRadius: 10,
                cursor: 'pointer',
                background: 'white',
                color: '#6366F1',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
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
                padding: '10px 28px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                fontFamily: 'inherit',
              }}
            >
              {saving ? '저장 중...' : step === 2 ? '완료' : '다음'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              style={{
                padding: '10px 28px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                fontFamily: 'inherit',
              }}
            >
              시작하기 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
