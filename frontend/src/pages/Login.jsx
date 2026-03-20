import { useState } from 'react';
import { login, register } from '../services/api';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
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
    padding: '11px 14px',
    border: `1.5px solid ${focusedInput === name ? '#6366F1' : '#E4E1F7'}`,
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: 5,
    fontFamily: 'inherit',
    background: '#FAFAFF',
    color: '#1E1B4B',
    boxShadow: focusedInput === name ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3730A3, #4F46E5, #7C3AED, #8B5CF6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating orbs */}
      <div className="orb" style={{ width: 360, height: 360, background: 'rgba(167,139,250,0.35)', top: '-120px', right: '-80px', animationDuration: '9s' }} />
      <div className="orb" style={{ width: 250, height: 250, background: 'rgba(99,102,241,0.3)', bottom: '60px', left: '-100px', animationDuration: '13s', animationDelay: '-5s' }} />
      <div className="orb" style={{ width: 180, height: 180, background: 'rgba(196,181,253,0.35)', top: '45%', left: '35%', animationDuration: '11s', animationDelay: '-2s' }} />
      <div className="orb" style={{ width: 120, height: 120, background: 'rgba(139,92,246,0.4)', bottom: '20%', right: '15%', animationDuration: '7s', animationDelay: '-3s' }} />

      <div
        className="login-card"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.7)',
          padding: '44px 40px',
          borderRadius: 24,
          width: 400,
          maxWidth: '100%',
          boxShadow: '0 16px 60px rgba(55,48,163,0.3), 0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
          }}>📅</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI 시간표</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#9CA3AF', letterSpacing: '0.01em' }}>
            스마트한 시간표 관리 서비스
          </p>
        </div>

        {/* Tab */}
        <div
          style={{
            display: 'flex',
            marginBottom: 24,
            background: '#EDE9FE',
            borderRadius: 10,
            padding: 4,
          }}
        >
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                borderRadius: 7,
                cursor: 'pointer',
                fontWeight: mode === m ? 700 : 500,
                background: mode === m ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                backgroundImage: mode === m ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'none',
                color: mode === m ? 'white' : '#7C73C0',
                fontSize: 14,
                boxShadow: mode === m ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: '10px 14px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              color: '#DC2626',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>아이디</label>
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
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>이메일</label>
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

          <div style={{ marginBottom: 26 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>비밀번호</label>
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
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              width: '100%',
              padding: '13px 0',
              background: loading ? '#C4B5FD' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              backgroundImage: loading ? 'none' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.4)',
              opacity: btnHovered && !loading ? 0.88 : 1,
              transform: btnHovered && !loading ? 'translateY(-1px)' : 'none',
              transition: 'opacity 0.15s, transform 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </form>

        {mode === 'login' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: 1, background: '#E4E1F7' }} />
              <span style={{ fontSize: 12, color: '#A5B4FC' }}>또는 소셜 로그인</span>
              <div style={{ flex: 1, height: 1, background: '#E4E1F7' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'Google', color: '#DB4437', bg: '#FEF2F2', border: '#FECACA' },
                { label: 'Naver', color: '#03C75A', bg: '#ECFDF5', border: '#6EE7B7' },
                { label: 'Kakao', color: '#391B1B', bg: '#FEFCE8', border: '#FDE68A' },
              ].map(({ label, color, bg, border }) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  title="준비 중입니다"
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    cursor: 'not-allowed',
                    background: bg,
                    color,
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0.7,
                    fontFamily: 'inherit',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 11, color: '#C4B5FD', textAlign: 'center' }}>
              소셜 로그인은 준비 중입니다
            </p>
          </>
        )}
      </div>
    </div>
  );
}
