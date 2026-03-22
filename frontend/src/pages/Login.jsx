import { useState } from 'react';
import { login, register } from '../services/api';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ username: form.username, email: form.email, password: form.password });
        setMode('login');
        setForm((prev) => ({ ...prev, email: '', password: '' }));
        alert('회원가입이 완료되었습니다! 로그인해 주세요.');
        return;
      }
      const res = await login(form.username, form.password);
      localStorage.setItem('token', res.data.access_token);
      await onLogin(res.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || '요청에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (name) => ({
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    background: '#e5e8eb',
    color: '#181c1e',
    boxShadow: focusedInput === name ? '0 0 0 2px rgba(26,77,178,0.2)' : 'none',
    transition: 'box-shadow 0.15s',
  });

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
    <div style={{ minHeight: '100vh', background: '#f7fafd', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        background: '#f7fafd',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        maxWidth: 1280, width: '100%', margin: '0 auto',
        alignSelf: 'center',
      }}>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: '#181c1e', letterSpacing: '-0.3px' }}>
          AI 시간표
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 60px)', position: 'relative', overflow: 'hidden' }}>
        {/* Blur orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 400, height: 400, background: '#3b66cc', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 280, height: 280, background: '#c3d0ff', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.18, pointerEvents: 'none' }} />

        {/* Left: Hero */}
        <div className="login-hero">
          <div>
            <span style={{ color: '#3B66CC', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Inter', sans-serif" }}>
              스마트 일정 관리
            </span>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 44, lineHeight: 1.15, color: '#181c1e', margin: '12px 0 16px', letterSpacing: '-0.5px' }}>
              AI로 완벽한<br />시간표를 만들어요.
            </h1>
            <p style={{ color: '#434653', fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: 0 }}>
              자연어로 일정을 관리하세요. AI가 수면 패턴과 시험 일정까지 고려해 최적의 시간표를 만들어 드립니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#fff', padding: 22, borderRadius: 16, boxShadow: '0 2px 12px rgba(24,28,30,0.06)', border: '1px solid rgba(195,198,213,0.15)' }}>
              <span className="material-symbols-outlined" style={{ color: '#3B66CC', fontSize: 26 }}>auto_awesome</span>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#181c1e', margin: '10px 0 4px', fontSize: 14 }}>스마트 스케줄링</h3>
              <p style={{ fontSize: 13, color: '#434653', margin: 0, lineHeight: 1.55 }}>AI가 빈 시간을 분석해 최적의 일정을 제안합니다.</p>
            </div>
            <div style={{ background: '#fff', padding: 22, borderRadius: 16, boxShadow: '0 2px 12px rgba(24,28,30,0.06)', border: '1px solid rgba(195,198,213,0.15)' }}>
              <span className="material-symbols-outlined" style={{ color: '#3B66CC', fontSize: 26 }}>schedule</span>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, color: '#181c1e', margin: '10px 0 4px', fontSize: 14 }}>시간 분석</h3>
              <p style={{ fontSize: 13, color: '#434653', margin: 0, lineHeight: 1.55 }}>수면 패턴과 시험 일정을 고려한 맞춤 계획을 수립합니다.</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #dae1ff, #c3d0ff)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 12, padding: '14px 22px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 28, color: '#1a4db2' }}>100%</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#505d85', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>무료 사용</div>
            </div>
            <div>
              <p style={{ color: '#1a4db2', fontWeight: 700, fontSize: 15, margin: '0 0 4px', fontFamily: "'Manrope', sans-serif" }}>지금 바로 시작하세요</p>
              <p style={{ color: '#505d85', fontSize: 13, margin: 0, lineHeight: 1.5 }}>회원가입 후 모든 기능을 무료로 이용할 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
          <div className="login-card" style={{
            width: '100%', maxWidth: 420,
            background: '#fff',
            borderRadius: 20,
            padding: '40px 38px',
            boxShadow: '0 20px 40px rgba(24,28,30,0.08), 0 2px 8px rgba(24,28,30,0.04)',
            border: '1px solid rgba(195,198,213,0.15)',
          }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 26, color: '#181c1e', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
                {mode === 'login' ? '로그인' : '계정 만들기'}
              </h2>
              <p style={{ color: '#434653', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                {mode === 'login' ? 'AI 시간표에 오신 걸 환영합니다.' : '스마트한 시간 관리를 시작하세요.'}
              </p>
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', background: '#ebeef1', borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setError(''); }}
                  style={{
                    flex: 1, padding: '9px 0',
                    border: 'none', borderRadius: 9,
                    cursor: 'pointer',
                    fontWeight: mode === m ? 700 : 500,
                    background: mode === m ? '#fff' : 'transparent',
                    color: mode === m ? '#1a4db2' : '#747684',
                    fontSize: 14,
                    boxShadow: mode === m ? '0 1px 4px rgba(24,28,30,0.1)' : 'none',
                    transition: 'all 0.15s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {m === 'login' ? '로그인' : '회원가입'}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '11px 14px', background: '#ffdad6', borderRadius: 10, color: '#ba1a1a', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>아이디</label>
                <input
                  value={form.username}
                  onChange={(e) => set('username', e.target.value)}
                  placeholder="아이디 입력"
                  style={inp('username')}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  autoComplete="username"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label style={labelStyle}>이메일</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="이메일 입력"
                    style={inp('email')}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    autoComplete="email"
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>비밀번호</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="비밀번호 입력"
                  style={inp('password')}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '15px 0', marginTop: 6,
                  background: loading ? '#b3c5ff' : '#1a4db2',
                  color: '#fff', border: 'none',
                  borderRadius: 9999,
                  fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(26,77,178,0.28)',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif",
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,77,178,0.38)'; e.currentTarget.style.filter = 'brightness(1.1)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,77,178,0.28)'; e.currentTarget.style.filter = 'none'; }}
                onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
              >
                {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
              </button>
            </form>

            {mode === 'login' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 18px' }}>
                  <div style={{ flex: 1, height: 1, background: '#ebeef1' }} />
                  <span style={{ fontSize: 12, color: '#747684', fontWeight: 600, whiteSpace: 'nowrap' }}>또는 소셜 로그인</span>
                  <div style={{ flex: 1, height: 1, background: '#ebeef1' }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Google', 'Naver', 'Kakao'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      title="준비 중입니다"
                      style={{
                        flex: 1, padding: '10px 0',
                        border: '1px solid #e5e8eb',
                        borderRadius: 9999,
                        cursor: 'not-allowed',
                        background: '#f1f4f7',
                        color: '#747684',
                        fontSize: 13, fontWeight: 600,
                        opacity: 0.65,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '10px 0 0', fontSize: 11, color: '#747684', textAlign: 'center' }}>
                  소셜 로그인은 준비 중입니다
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
