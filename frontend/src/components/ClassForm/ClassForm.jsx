import { useState } from 'react';

const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

const DEFAULT_FORM = {
  title: '',
  day_of_week: 0,
  start_time: '09:00',
  end_time: '10:30',
  location: '',
  color: '#6366F1',
};

export default function ClassForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, location: initial.location || '' }
      : DEFAULT_FORM
  );
  const [error, setError] = useState('');
  const [cancelHovered, setCancelHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('강의명을 입력하세요.');
      return;
    }
    if (form.start_time >= form.end_time) {
      setError('종료 시간이 시작 시간보다 늦어야 합니다.');
      return;
    }
    try {
      await onSubmit({ ...form, day_of_week: Number(form.day_of_week) });
    } catch (err) {
      setError(err.response?.data?.detail || '저장에 실패했습니다.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #E4E1F7',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    background: '#FAFAFF',
    color: '#1E1B4B',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#6366F1',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, color: '#DC2626', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>강의명 *</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="예: 알고리즘"
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>요일 *</label>
        <select
          value={form.day_of_week}
          onChange={(e) => set('day_of_week', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {DAYS.map((d, i) => (
            <option key={i} value={i}>{d}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>시작 시간 *</label>
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => set('start_time', e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>종료 시간 *</label>
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => set('end_time', e.target.value)}
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>강의실</label>
        <input
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="예: 공학관 301호"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>색상</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set('color', c)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: c,
                border: form.color === c ? '3px solid white' : '3px solid transparent',
                outline: form.color === c ? '2.5px solid #6366F1' : 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'transform 0.1s',
                transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            style={{
              padding: '9px 18px',
              border: '1.5px solid #E4E1F7',
              borderRadius: 8,
              cursor: 'pointer',
              background: cancelHovered ? '#F5F3FF' : 'white',
              fontSize: 14,
              color: '#6366F1',
              fontFamily: 'inherit',
              fontWeight: 600,
              transition: 'background 0.15s',
            }}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          onMouseEnter={() => setSubmitHovered(true)}
          onMouseLeave={() => setSubmitHovered(false)}
          style={{
            padding: '9px 22px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            backgroundImage: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            opacity: submitHovered ? 0.88 : 1,
            transform: submitHovered ? 'translateY(-1px)' : 'none',
            transition: 'opacity 0.15s, transform 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {initial ? '수정 완료' : '추가'}
        </button>
      </div>
    </form>
  );
}
