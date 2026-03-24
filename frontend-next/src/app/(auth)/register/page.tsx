'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setToken, setUser } = useAuthStore();
  const registerMutation = useRegister();
  const loginMutation = useLogin();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = '아이디를 입력해주세요';
    else if (form.username.length < 3) newErrors.username = '아이디는 3자 이상이어야 합니다';
    if (!form.email.trim()) newErrors.email = '이메일을 입력해주세요';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = '올바른 이메일 형식이 아닙니다';
    if (!form.password) newErrors.password = '비밀번호를 입력해주세요';
    else if (form.password.length < 6) newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    registerMutation.mutate(
      { username: form.username, email: form.email, password: form.password },
      {
        onSuccess: (user) => {
          // Auto-login after register
          loginMutation.mutate(
            { username: form.username, password: form.password },
            {
              onSuccess: async (tokenData) => {
                setToken(tokenData.access_token);
                setUser(user);
                queryClient.invalidateQueries({ queryKey: ['me'] });
                toast.success('회원가입이 완료되었습니다');
                router.push('/onboarding');
              },
            }
          );
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { detail?: string } } };
          const detail = error?.response?.data?.detail;
          if (detail?.includes('username')) {
            toast.error('이미 사용 중인 아이디입니다');
          } else if (detail?.includes('email')) {
            toast.error('이미 사용 중인 이메일입니다');
          } else {
            toast.error('회원가입 중 오류가 발생했습니다');
          }
        },
      }
    );
  };

  return (
    <>
      <style>{`
        .font-headline { font-family: var(--font-manrope), Manrope, sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ background: '#f7fafd', color: '#181c1e' }}>
        {/* Nav */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
          style={{ background: 'rgba(247,250,253,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #ebeef1' }}
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
              href="/login"
              className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-80"
              style={{ background: '#ebeef1', color: '#1a4db2' }}
            >
              로그인
            </Link>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-grow flex pt-16">
          {/* Left Panel */}
          <div
            className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-12"
            style={{ background: '#1a4db2', color: '#fff' }}
          >
            <div className="max-w-md">
              <h2
                className="font-headline text-4xl font-bold mb-4 leading-tight"
              >
                Master your time
                <br />
                with AI precision.
              </h2>
              <p className="text-base leading-relaxed mb-10 opacity-90">
                AI가 당신의 학습 패턴을 분석하고, 최적화된 시간표를 설계해 드립니다.
                지금 바로 스마트한 시간 관리를 시작하세요.
              </p>

              <div className="flex flex-col gap-4 mb-10">
                <div
                  className="rounded-2xl p-5 flex items-start gap-4"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      psychology
                    </span>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Smart Scheduling</div>
                    <div className="text-sm opacity-80">AI가 최적의 공부 시간을 예측하고 추천합니다</div>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-5 flex items-start gap-4"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      insights
                    </span>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Time Insights</div>
                    <div className="text-sm opacity-80">학습 효율을 분석하고 개선점을 제안합니다</div>
                  </div>
                </div>
              </div>

              {/* Decorative box */}
              <div
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3b66cc 0%, #1a4db2 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                  style={{ background: '#c3d0ff' }}
                />
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-15"
                  style={{ background: '#ffdcc6' }}
                />
                <div className="relative z-10">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>trending_up</span>
                    <span className="font-bold text-lg">85% 효율 향상</span>
                  </div>
                  <div className="text-sm opacity-80">Chronos AI 사용자 평균 학습 효율 향상율</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              <div
                className="bg-white rounded-xl p-8 shadow-sm"
                style={{ border: '1px solid #ebeef1' }}
              >
                <div className="mb-6">
                  <h1
                    className="font-headline text-2xl font-bold mb-1"
                    style={{ color: '#181c1e' }}
                  >
                    계정 만들기
                  </h1>
                  <p className="text-sm" style={{ color: '#434653' }}>
                    Chronos AI와 함께 스마트한 시간 관리를 시작하세요
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
                      placeholder="아이디 (3자 이상)"
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

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: '#434653' }}
                    >
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="이메일 주소"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                      style={{
                        background: '#f1f4f7',
                        border: errors.email ? '1.5px solid #ef4444' : '1.5px solid transparent',
                        color: '#181c1e',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      }}
                    />
                    {errors.email && (
                      <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>
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
                      placeholder="비밀번호 (6자 이상)"
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

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: '#434653' }}
                    >
                      비밀번호 확인
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg outline-none transition-all focus:ring-2"
                      style={{
                        background: '#f1f4f7',
                        border: errors.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid transparent',
                        color: '#181c1e',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      }}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending || loginMutation.isPending}
                    className="w-full py-4 rounded-full font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    style={{
                      background: '#3B66CC',
                      boxShadow: '0 4px 16px rgba(59,102,204,0.3)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a4db2'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#3B66CC'; }}
                  >
                    {registerMutation.isPending || loginMutation.isPending ? '처리 중...' : '회원가입'}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: '#ebeef1' }} />
                  <span className="text-xs" style={{ color: '#434653' }}>또는</span>
                  <div className="flex-1 h-px" style={{ background: '#ebeef1' }} />
                </div>

                <div className="mt-4 text-center text-sm" style={{ color: '#434653' }}>
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="font-bold hover:underline" style={{ color: '#1a4db2' }}>
                    로그인
                  </Link>
                </div>
              </div>
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
