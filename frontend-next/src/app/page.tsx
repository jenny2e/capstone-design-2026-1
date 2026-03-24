'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 20) {
          navRef.current.style.background = 'rgba(247,250,253,0.92)';
          navRef.current.style.boxShadow = '0 1px 12px rgba(26,77,178,0.08)';
        } else {
          navRef.current.style.background = 'transparent';
          navRef.current.style.boxShadow = 'none';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .font-headline { font-family: var(--font-manrope), Manrope, sans-serif; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
        .mesh-gradient { background: linear-gradient(-45deg,#f7fafd,#eef1f4,#dae1ff,#f7fafd); background-size:400% 400%; animation:meshFlow 20s ease infinite; }
        @keyframes meshFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .animate-fade-up{animation:fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards}
        .animate-float{animation:float 6s ease-in-out infinite}
        .stagger-1{animation-delay:0.1s;opacity:0} .stagger-2{animation-delay:0.2s;opacity:0} .stagger-3{animation-delay:0.3s;opacity:0} .stagger-4{animation-delay:0.4s;opacity:0}
        .reveal-on-scroll{opacity:0;transform:scale(0.95) translateY(20px);transition:all 0.8s cubic-bezier(0.16,1,0.3,1)}
        .reveal-on-scroll.active{opacity:1;transform:scale(1) translateY(0)}
      `}</style>

      <div className="min-h-screen" style={{ background: '#f7fafd', color: '#181c1e' }}>
        {/* Navbar */}
        <nav
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium transition-colors" style={{ color: '#434653' }}>
                Features
              </a>
              <a href="#about" className="text-sm font-medium transition-colors" style={{ color: '#434653' }}>
                About
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 rounded-full transition-all"
                style={{ color: '#1a4db2' }}
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-90"
                style={{ background: '#1a4db2', color: '#fff' }}
              >
                시작하기
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="mesh-gradient min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-up stagger-1"
              style={{ background: '#c3d0ff', color: '#1a4db2' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                auto_awesome
              </span>
              <span className="text-sm font-semibold">AI-Powered Efficiency</span>
            </div>

            <h1
              className="font-headline animate-fade-up stagger-2 mb-6"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#181c1e',
              }}
            >
              AI로 혁신하는
              <br />
              <span style={{ color: '#1a4db2' }}>나만의 시간표</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-3"
              style={{ color: '#434653' }}
            >
              자연어로 일정을 추가하고, AI가 최적의 시간표를 설계해 드립니다.
              수업, 시험, 자율학습까지 한 곳에서 스마트하게 관리하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 hover:opacity-90"
                style={{
                  background: '#1a4db2',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(26,77,178,0.25)',
                }}
              >
                무료로 시작하기
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  color: '#1a4db2',
                  border: '1.5px solid #c3d0ff',
                }}
              >
                로그인
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section id="features" className="py-24 px-6" style={{ background: '#f1f4f7' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2
                className="font-headline text-3xl md:text-4xl font-bold mb-4"
                style={{ color: '#181c1e' }}
              >
                한눈에 보는 나의 일정
              </h2>
              <p style={{ color: '#434653' }}>직관적인 대시보드로 모든 일정을 한 번에 파악하세요</p>
            </div>

            <div className="grid grid-cols-12 gap-4 reveal-on-scroll animate-float">
              {/* Left Sidebar */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                {/* Upcoming Events Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: '#fff', border: '1px solid #ebeef1', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: '20px' }}>
                      event_upcoming
                    </span>
                    <span className="font-bold text-sm" style={{ color: '#181c1e' }}>다가오는 일정</span>
                  </div>
                  {[
                    { name: '수학 수업', time: '오전 9:00', color: '#c3d0ff' },
                    { name: '영어 과제 제출', time: '오후 2:00', color: '#ffdcc6' },
                    { name: '물리 시험 준비', time: '오후 5:00', color: '#c3d0ff' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#1a4db2' }} />
                      <div className="flex-1">
                        <div className="text-sm font-medium" style={{ color: '#181c1e' }}>{item.name}</div>
                        <div className="text-xs" style={{ color: '#434653' }}>{item.time}</div>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: item.color, color: '#1a4db2' }}
                      >
                        오늘
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Insights Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: '#1a4db2', color: '#fff' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      psychology
                    </span>
                    <span className="font-bold text-sm">AI 인사이트</span>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    이번 주 공부 시간이 12% 증가했어요! 화요일 오후 빈 시간에 복습 세션을 추가해보는 건 어떨까요?
                  </p>
                  <div
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                    일정 추가
                  </div>
                </div>
              </div>

              {/* Main Calendar */}
              <div
                className="col-span-12 lg:col-span-8 rounded-2xl p-5"
                style={{ background: '#fff', border: '1px solid #ebeef1', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold" style={{ color: '#181c1e' }}>이번 주 시간표</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#434653', cursor: 'pointer' }}>
                      chevron_left
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#434653' }}>3월 4주</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#434653', cursor: 'pointer' }}>
                      chevron_right
                    </span>
                  </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {['월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="text-center text-xs font-bold py-1" style={{ color: '#434653' }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Schedule Blocks */}
                <div className="grid grid-cols-6 gap-2">
                  {[
                    [
                      { label: '수학', time: '9:00', color: '#c3d0ff', textColor: '#1a4db2' },
                      { label: '자율학습', time: '14:00', color: '#f1f4f7', textColor: '#434653' },
                    ],
                    [
                      { label: '영어', time: '10:00', color: '#ffdcc6', textColor: '#8b4500' },
                      { label: '물리', time: '15:00', color: '#c3d0ff', textColor: '#1a4db2' },
                    ],
                    [
                      { label: '화학', time: '9:00', color: '#c3d0ff', textColor: '#1a4db2' },
                      { label: '국어', time: '13:00', color: '#ffdcc6', textColor: '#8b4500' },
                    ],
                    [
                      { label: '수학', time: '11:00', color: '#c3d0ff', textColor: '#1a4db2' },
                      { label: '복습', time: '16:00', color: '#f1f4f7', textColor: '#434653' },
                    ],
                    [
                      { label: '영어', time: '9:00', color: '#ffdcc6', textColor: '#8b4500' },
                      { label: '시험준비', time: '14:00', color: '#c3d0ff', textColor: '#1a4db2' },
                    ],
                    [
                      { label: '자유', time: '10:00', color: '#f1f4f7', textColor: '#434653' },
                    ],
                  ].map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-2">
                      {col.map((block, bi) => (
                        <div
                          key={bi}
                          className="rounded-xl px-2 py-2 text-xs font-semibold"
                          style={{ background: block.color, color: block.textColor }}
                        >
                          <div>{block.label}</div>
                          <div className="opacity-70 font-normal mt-0.5">{block.time}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section className="py-24 px-6" style={{ background: '#f7fafd' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2
                className="font-headline text-3xl md:text-4xl font-bold mb-4"
                style={{ color: '#181c1e' }}
              >
                더 스마트하게, 더 효율적으로
              </h2>
              <p style={{ color: '#434653' }}>AI가 당신의 시간을 최적화합니다</p>
            </div>

            {/* Top 2-col bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 reveal-on-scroll">
              <div
                className="md:col-span-2 rounded-2xl p-8"
                style={{ background: '#fff', border: '1px solid #ebeef1', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#ebeef1' }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#1a4db2' }}>
                    psychology_alt
                  </span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-2" style={{ color: '#181c1e' }}>
                  예측형 스케줄링
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#434653' }}>
                  AI가 과거 패턴을 학습하여 최적의 공부 시간과 휴식 패턴을 예측하고 추천해드립니다.
                  개인화된 시간 관리로 생산성을 극대화하세요.
                </p>
              </div>

              <div
                className="rounded-2xl p-8 flex flex-col justify-between"
                style={{ background: '#1a4db2', color: '#fff' }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <span className="material-symbols-outlined">sync</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">자동 동기화</h3>
                  <p className="text-sm leading-relaxed opacity-90">
                    모든 기기에서 실시간으로 동기화되어 언제 어디서나 최신 일정을 확인하세요.
                  </p>
                </div>
                <div
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#c3d0ff' }}
                >
                  자세히 보기
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </div>
              </div>
            </div>

            {/* 3 feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal-on-scroll">
              {[
                {
                  icon: 'chat',
                  title: 'AI 자연어 입력',
                  desc: '"매주 월요일 오전 9시에 수학 수업 추가해줘"처럼 자연어로 일정을 관리하세요.',
                  bg: '#ebeef1',
                  iconColor: '#1a4db2',
                },
                {
                  icon: 'calendar_view_week',
                  title: '시각적 시간표',
                  desc: '7일 그리드 형태의 직관적인 시간표로 한눈에 일정을 파악하고 관리하세요.',
                  bg: '#ffdcc6',
                  iconColor: '#8b4500',
                },
                {
                  icon: 'quiz',
                  title: '시험 일정 관리',
                  desc: '다가오는 시험 일정을 등록하고, 남은 기간을 확인하며 효율적으로 준비하세요.',
                  bg: '#c3d0ff',
                  iconColor: '#1a4db2',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                  style={{ background: '#fff', border: '1px solid #ebeef1', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: card.bg }}
                  >
                    <span className="material-symbols-outlined" style={{ color: card.iconColor }}>
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold mb-2" style={{ color: '#181c1e' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#434653' }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="about" style={{ background: '#ebeef1' }} className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: '#1a4db2' }}
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '16px' }}>
                      schedule
                    </span>
                  </div>
                  <span className="font-bold font-headline" style={{ color: '#181c1e' }}>Chronos AI</span>
                </div>
                <p className="text-sm" style={{ color: '#434653' }}>
                  AI 기반 스마트 시간표 관리 서비스
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3" style={{ color: '#181c1e' }}>서비스</h4>
                <div className="flex flex-col gap-2">
                  {['시간표 관리', 'AI 일정 추천', '시험 준비'].map((item) => (
                    <span key={item} className="text-sm" style={{ color: '#434653' }}>{item}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3" style={{ color: '#181c1e' }}>지원</h4>
                <div className="flex flex-col gap-2">
                  {['이용약관', '개인정보처리방침', '문의하기'].map((item) => (
                    <span key={item} className="text-sm" style={{ color: '#434653' }}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t pt-6 text-center text-sm" style={{ borderColor: '#d0d3d6', color: '#434653' }}>
              © 2025 Chronos AI. AI 기반 일정 관리 서비스
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
