'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import AuthNavbar from '@/components/layout/AuthNavbar';
import AuthFooter from '@/components/layout/AuthFooter';
import MaterialIcon from '@/components/common/MaterialIcon';

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
        .register-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: var(--skema-surface-low);
          color: var(--skema-on-surface);
          font-family: Inter, sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }
        .register-input:focus {
          box-shadow: 0 0 0 2px rgba(26,77,178,0.15);
        }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ background: 'var(--skema-surface)', color: 'var(--skema-on-surface)' }}>
        <AuthNavbar mode="register" />

        {/* Main */}
        <main className="flex-grow flex pt-16">
          {/* Left Panel */}
          <div
            className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-12"
            style={{ background: 'var(--skema-primary)', color: '#fff' }}
          >
            <div className="max-w-md">
              <h2
                className="skema-headline text-4xl font-bold mb-4 leading-tight"
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
                    <MaterialIcon icon="psychology" size={20} color="#fff" />
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
                    <MaterialIcon icon="insights" size={20} color="#fff" />
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
                  style={{ background: 'var(--skema-secondary-container)' }}
                />
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-15"
                  style={{ background: 'var(--skema-tertiary-fixed)' }}
                />
                <div className="relative z-10">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                  >
                    <MaterialIcon icon="trending_up" size={18} color="#fff" />
                    <span className="font-bold text-lg">85% 효율 향상</span>
                  </div>
                  <div className="text-sm opacity-80">SKEMA 사용자 평균 학습 효율 향상율</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              <div
                className="bg-white rounded-xl p-8 shadow-sm"
                style={{ border: '1px solid var(--skema-container)' }}
              >
                <div className="mb-6">
                  <h1
                    className="skema-headline text-2xl font-bold mb-1"
                    style={{ color: 'var(--skema-on-surface)' }}
                  >
                    계정 만들기
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--skema-on-surface-variant)' }}>
                    SKEMA와 함께 스마트한 시간 관리를 시작하세요
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--skema-on-surface-variant)' }}
                    >
                      아이디
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="아이디 (3자 이상)"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="register-input"
                      style={{
                        border: errors.username ? '1.5px solid #ef4444' : '1.5px solid transparent',
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
                      style={{ color: 'var(--skema-on-surface-variant)' }}
                    >
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="이메일 주소"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="register-input"
                      style={{
                        border: errors.email ? '1.5px solid #ef4444' : '1.5px solid transparent',
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
                      style={{ color: 'var(--skema-on-surface-variant)' }}
                    >
                      비밀번호
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="비밀번호 (6자 이상)"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="register-input"
                      style={{
                        border: errors.password ? '1.5px solid #ef4444' : '1.5px solid transparent',
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
                      style={{ color: 'var(--skema-on-surface-variant)' }}
                    >
                      비밀번호 확인
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="register-input"
                      style={{
                        border: errors.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid transparent',
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
                      background: 'var(--skema-primary-hover)',
                      boxShadow: '0 4px 16px var(--skema-primary-shadow)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--skema-primary)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--skema-primary-hover)'; }}
                  >
                    {registerMutation.isPending || loginMutation.isPending ? '처리 중...' : '회원가입'}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background: 'var(--skema-container)' }} />
                  <span className="text-xs" style={{ color: 'var(--skema-on-surface-variant)' }}>또는</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--skema-container)' }} />
                </div>

                <div className="mt-4 text-center text-sm" style={{ color: 'var(--skema-on-surface-variant)' }}>
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="font-bold hover:underline" style={{ color: 'var(--skema-primary)' }}>
                    로그인
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AuthFooter />
      </div>
    </>
  );
}
