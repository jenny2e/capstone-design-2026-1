import { useState } from 'react';

const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
const COLORS = [
  '#1a4db2', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

const DEFAULT_FORM = {
  title: '',
  day_of_week: 0,
  start_time: '09:00',
  end_time: '10:30',
  location: '',
  color: '#1a4db2',
};

export default function ClassForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(initial ? { ...initial, location: initial.location || '' } : DEFAULT_FORM);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('강의명을 입력하세요.'); return; }
    if (form.start_time >= form.end_time) { setError('종료 시간이 시작 시간보다 늦어야 합니다.'); return; }
    try {
      await onSubmit({ ...form, day_of_week: Number(form.day_of_week) });
    } catch (err) {
      setError(err.response?.data?.detail || '저장에 실패했습니다.');
    }
  };

  const inputStyle = (name) => ({
    width: '100%', padding: '11px 14px', border: 'none', borderRadius: 12,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif", background: '#e5e8eb', color: '#181c1e',
    boxShadow: focusedInput === name ? '0 0 0 2px rgba(26,77,178,0.2)' : 'none',
    transition: 'box-shadow 0.15s',
  });

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#434653',
    marginBottom: 6, marginLeft: 2, textTransform: 'uppercase',
    letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif",
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#ffdad6', borderRadius: 10, color: '#ba1a1a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>강의명 *</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="예: 알고리즘" style={inputStyle('title')} onFocus={() => setFocusedInput('title')} onBlur={() => setFocusedInput(null)} required />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>요일 *</label>
        <select value={form.day_of_week} onChange={(e) => set('day_of_week', e.target.value)} style={{ ...inputStyle('day'), cursor: 'pointer' }} onFocus={() => setFocusedInput('day')} onBlur={() => setFocusedInput(null)}>
          {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>시작 시간 *</label>
          <input type="time" value={form.start_time} onChange={(e) => set('start_time', e.target.value)} style={inputStyle('start')} onFocus={() => setFocusedInput('start')} onBlur={() => setFocusedInput(null)} required />
        </div>
        <div>
          <label style={labelStyle}>종료 시간 *</label>
          <input type="time" value={form.end_time} onChange={(e) => set('end_time', e.target.value)} style={inputStyle('end')} onFocus={() => setFocusedInput('end')} onBlur={() => setFocusedInput(null)} required />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>강의실</label>
        <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="예: 공학관 301호" style={inputStyle('location')} onFocus={() => setFocusedInput('location')} onBlur={() => setFocusedInput(null)} />
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>색상</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set('color', c)}
              style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: c, border: form.color === c ? '3px solid #fff' : '3px solid transparent', outline: form.color === c ? `2.5px solid ${c}` : 'none', cursor: 'pointer', padding: 0, transition: 'transform 0.1s', transform: form.color === c ? 'scale(1.2)' : 'scale(1)' }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '10px 20px', border: '1.5px solid #e5e8eb', borderRadius: 9999, cursor: 'pointer', background: '#fff', fontSize: 14, color: '#434653', fontFamily: "'Inter', sans-serif", fontWeight: 600, transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          style={{ padding: '10px 24px', background: '#1a4db2', color: '#fff', border: 'none', borderRadius: 9999, cursor: 'pointer', fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(26,77,178,0.25)', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
        >
          {initial ? '수정 완료' : '추가'}
        </button>
      </div>
    </form>
  );
}
