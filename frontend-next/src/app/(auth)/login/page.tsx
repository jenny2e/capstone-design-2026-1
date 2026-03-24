'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuthStore();
  const loginMutation = useLogin();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = '아이디를 입력해주세요';
    if (!form.password) newErrors.password = '비밀번호를 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutation.mutate(form, {
      onSuccess: async (data) => {
        setToken(data.access_token);
        // Fetch user info
        try {
          const { api } = await import('@/lib/api');
          const { data: user } = await api.get('/auth/me');
          setUser(user);
        } catch {
          // ignore
        }
        queryClient.invalidateQueries({ queryKey: ['me'] });
        toast.success('로그인 되었습니다');
        router.push('/dashboard');
      },
      onError: (err: unknown) => {
        const error = err as { response?: { status?: number } };
        if (error?.response?.status === 401) {
          toast.error('아이디 또는 비밀번호가 올바르지 않습니다');
        } else {
          toast.error('로그인 중 오류가 발생했습니다');
        }
      },
    });
  };

  return (
    <>
      <style>{`
        .font-headline { font-family: var(--font-manrope), Manrope, sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ background: '#f7fafd', color: '#181c1e' }}>
        {/* Navbar */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
          style={{
            background: 'rgba(247,250,253,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #ebeef1',
          }}
        >
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#1a4db2' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>
                  schedule
                </span>
              </div>
              <span className="font-bold text-lg font-headline" style={{ color: '#181c1e' }}>
                Chronos AI
              </span>
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-80"
              style={{ background: '#1a4db2', color: '#fff' }}
            >
              회원가입
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden pt-16">
          {/* Abstract background blobs */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '-80px',
              left: '-80px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'rgba(195,208,255,0.45)',
              filter: 'blur(120px)',
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: '-60px',
              right: '-60px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'rgba(26,77,178,0.15)',
              filter: 'blur(120px)',
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: '40%',
              right: '15%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,220,198,0.35)',
              filter: 'blur(80px)',
            }}
          />

          {/* Card */}
          <div
            className="relative z-10 w-full max-w-md bg-white rounded-xl p-8 md:p-10 shadow-lg"
            style={{ border: '1px solid #ebeef1' }}
          >
            {/* Icon + Title */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: '#ebeef1' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: '28px' }}>
                  lock
                </span>
              </div>
              <h1
                className="font-headline text-2xl font-bold mb-1"
                style={{ color: '#181c1e' }}
              >
                로그인
              </h1>
              <p className="text-sm" style={{ color: '#434653' }}>
                Chronos AI에 오신 것을 환영합니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: '#434653' }}
                >
                  아이디
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                  style={{
                    background: '#f1f4f7',
                    border: errors.username ? '1.5px solid #ef4444' : '1.5px solid transparent',
                    color: '#181c1e',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  }}
                />
                {errors.username && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: '#434653' }}
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                  style={{
                    background: '#f1f4f7',
                    border: errors.password ? '1.5px solid #ef4444' : '1.5px solid transparent',
                    color: '#181c1e',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  }}
                />
                {errors.password && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-4 rounded-full font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: '#1a4db2',
                  boxShadow: '0 8px 24px rgba(26,77,178,0.2)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#3b66cc'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a4db2'; }}
              >
                {loginMutation.isPending ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid #ebeef1' }}>
              <p className="text-center text-sm" style={{ color: '#434653' }}>
                계정이 없으신가요?{' '}
                <Link
                  href="/register"
                  className="font-bold hover:underline inline-flex items-center gap-1"
                  style={{ color: '#1a4db2' }}
                >
                  회원가입
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    arrow_forward
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 text-center text-xs" style={{ background: '#ebeef1', color: '#434653' }}>
          © 2025 Chronos AI. AI 기반 일정 관리 서비스
        </footer>
      </div>
    </>
  );
}
