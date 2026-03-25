'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: '소개', href: '#intro' },
  { label: '미리보기', href: '#preview' },
  { label: '기능', href: '#features' },
];

export default function LandingPage() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll-spy: update active nav item based on visible section
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      navRef.current.style.background =
        window.scrollY > 30 ? 'rgba(247,250,253,0.96)' : 'transparent';
      navRef.current.style.boxShadow =
        window.scrollY > 30 ? '0 1px 16px rgba(26,77,178,0.07)' : 'none';
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll on nav click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <style>{`
        .font-headline { font-family: var(--font-manrope), Manrope, sans-serif; }
        .ms {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal;
          font-size: 24px; line-height: 1;
          letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap;
          direction: ltr; -webkit-font-smoothing: antialiased;
          font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;
        }
        /* mesh hero */
        .mesh {
          background: linear-gradient(-45deg,#f7fafd,#eef1f4,#dae1ff,#f7fafd);
          background-size: 400% 400%;
          animation: meshFlow 18s ease infinite;
        }
        @keyframes meshFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        /* fade-up entrance */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fu  { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .d1  { animation-delay: 0.1s; }
        .d2  { animation-delay: 0.22s; }
        .d3  { animation-delay: 0.36s; }
        .d4  { animation-delay: 0.50s; }
        /* scroll reveal */
        .reveal {
          opacity:0; transform:translateY(24px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.active { opacity:1; transform:translateY(0); }
        .reveal.d-1 { transition-delay: 0.05s; }
        .reveal.d-2 { transition-delay: 0.15s; }
        .reveal.d-3 { transition-delay: 0.25s; }
        /* float */
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 5s ease-in-out infinite; }
        /* brand letter split */
        .brand-letter {
          display: inline-block;
          transition: color 0.2s, transform 0.2s;
        }
        .brand-letter:hover { color: #3b66cc; transform: translateY(-3px); }
        /* nav active indicator */
        .nav-link-active {
          color: #1a4db2 !important;
          font-weight: 700;
          text-decoration: none !important;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7fafd', color: '#181c1e' }}>

        {/* ── Navbar ── */}
        <nav
          ref={navRef}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="ms" style={{ fontSize: '17px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>schedule</span>
              </div>
              <span className="font-headline" style={{ fontWeight: 800, fontSize: '20px', color: '#181c1e', letterSpacing: '-0.3px' }}>SKEMA</span>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
              {NAV_ITEMS.map(({ label, href }) => {
                const id = href.slice(1);
                const isActive = activeSection === id;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={isActive ? 'nav-link-active' : ''}
                    style={{
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#1a4db2' : '#434653',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}
                  >
                    {label}
                    {isActive && (
                      <div style={{ height: '2px', background: '#1a4db2', borderRadius: '2px', marginTop: '2px' }} />
                    )}
                  </a>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#1a4db2', padding: '8px 16px', borderRadius: '999px', textDecoration: 'none', transition: 'background 0.2s' }}>
                로그인
              </Link>
              <Link href="/register" style={{ fontSize: '14px', fontWeight: 700, color: '#fff', background: '#1a4db2', padding: '8px 20px', borderRadius: '999px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(26,77,178,0.25)', transition: 'opacity 0.2s, transform 0.2s' }}>
                시작하기
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="mesh" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
            <div className="fu d1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#c3d0ff', color: '#1a4db2', borderRadius: '999px', padding: '6px 16px', marginBottom: '28px', fontSize: '13px', fontWeight: 700 }}>
              <span className="ms" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              AI 기반 스마트 시간표 관리
            </div>

            <h1 className="font-headline fu d2" style={{ fontSize: 'clamp(2.8rem,8vw,5.2rem)', fontWeight: 800, lineHeight: 1.1, color: '#181c1e', marginBottom: '24px', letterSpacing: '-1px' }}>
              당신의 시간을
              <br />
              <span style={{ color: '#1a4db2' }}>설계하세요</span>
            </h1>

            <p className="fu d3" style={{ fontSize: '18px', color: '#434653', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 36px', fontWeight: 400 }}>
              자연어로 일정을 입력하면 AI가 최적의 시간표를 완성합니다.
              수업, 시험, 자율학습까지 한 곳에서 관리하세요.
            </p>

            <div className="fu d4" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              <Link href="/register" style={{ background: '#1a4db2', color: '#fff', padding: '14px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(26,77,178,0.28)', transition: 'transform 0.2s, opacity 0.2s' }}>
                무료로 시작하기
              </Link>
              <a href="#intro" onClick={(e) => handleNavClick(e, '#intro')} style={{ background: 'rgba(255,255,255,0.85)', color: '#1a4db2', padding: '14px 32px', borderRadius: '999px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1.5px solid #c3d0ff', cursor: 'pointer', transition: 'transform 0.2s' }}>
                더 알아보기
              </a>
            </div>

            {/* Scroll hint */}
            <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
              <span style={{ fontSize: '12px', color: '#434653', letterSpacing: '1px' }}>스크롤</span>
              <span className="ms" style={{ fontSize: '20px', color: '#434653', animation: 'float 2s ease-in-out infinite' }}>keyboard_arrow_down</span>
            </div>
          </div>
        </section>

        {/* ── 소개 (Brand Story) ── */}
        <section id="intro" style={{ padding: '100px 24px', background: '#fff' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

            {/* Section label */}
            <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
              <div style={{ width: '32px', height: '2px', background: '#1a4db2', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a4db2', letterSpacing: '2px', textTransform: 'uppercase' }}>소개</span>
            </div>

            {/* Brand name big */}
            <div className="reveal" style={{ marginBottom: '20px' }}>
              <div className="font-headline" style={{ fontSize: 'clamp(3.5rem,10vw,8rem)', fontWeight: 800, lineHeight: 1, color: '#181c1e', letterSpacing: '-3px', userSelect: 'none' }}>
                {'SKEMA'.split('').map((ch, i) => (
                  <span key={i} className="brand-letter">{ch}</span>
                ))}
              </div>
            </div>

            {/* Etymology */}
            <div className="reveal d-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#f1f4f7', borderRadius: '12px', padding: '10px 18px', marginBottom: '48px' }}>
              <span className="ms" style={{ fontSize: '18px', color: '#1a4db2', fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              <span style={{ fontSize: '14px', color: '#434653' }}>
                <b style={{ color: '#181c1e' }}>Scheme</b>에서 영감을 받아 — &ldquo;체계적인 계획&rdquo;을 의미합니다
              </span>
            </div>

            {/* 3-column intro cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                {
                  icon: 'architecture',
                  title: '설계하다',
                  en: 'Scheme',
                  desc: 'SKEMA의 이름은 라틴어 Schema(도식, 구조)와 영어 Scheme(계획, 체계)에서 비롯되었습니다. 하루를 단순히 기록하는 것이 아닌, 능동적으로 설계한다는 철학을 담았습니다.',
                  bg: '#f1f4f7',
                  iconBg: '#ebeef1',
                  iconColor: '#1a4db2',
                },
                {
                  icon: 'smart_toy',
                  title: 'AI와 함께',
                  en: 'Powered by AI',
                  desc: '대화하듯 일정을 말하면 AI가 이해하고 배치합니다. 복잡한 UI 없이 자연어 한 문장으로 시간표를 완성하세요. SKEMA의 AI는 당신의 패턴을 기억하고 점점 더 똑똑해집니다.',
                  bg: '#1a4db2',
                  iconBg: 'rgba(255,255,255,0.15)',
                  iconColor: '#fff',
                  dark: true,
                },
                {
                  icon: 'lightbulb',
                  title: '당신을 위한',
                  en: 'Made for You',
                  desc: '학생, 직장인, 프리랜서 — 누구에게나 맞는 시간 관리가 필요합니다. SKEMA는 개인의 생활 패턴과 우선순위에 맞춰 시간표를 자동으로 최적화합니다.',
                  bg: '#f1f4f7',
                  iconBg: '#ffdcc6',
                  iconColor: '#844000',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`reveal d-${i + 1}`}
                  style={{
                    background: card.bg,
                    borderRadius: '20px',
                    padding: '36px 32px',
                    color: card.dark ? '#fff' : '#181c1e',
                    transition: 'transform 0.25s',
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <span className="ms" style={{ color: card.iconColor, fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', opacity: 0.6, marginBottom: '8px', textTransform: 'uppercase' }}>{card.en}</div>
                  <h3 className="font-headline" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '14px' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: card.dark ? 0.88 : 1, color: card.dark ? '#fff' : '#434653' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 미리보기 (Preview) ── */}
        <section id="preview" style={{ padding: '100px 24px', background: '#f1f4f7' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

            <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '2px', background: '#1a4db2', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a4db2', letterSpacing: '2px', textTransform: 'uppercase' }}>미리보기</span>
            </div>

            <div className="reveal" style={{ marginBottom: '56px' }}>
              <h2 className="font-headline" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#181c1e', marginBottom: '12px' }}>
                한눈에 보는 나의 일정
              </h2>
              <p style={{ fontSize: '16px', color: '#434653' }}>직관적인 대시보드로 모든 일정을 한 번에 파악하세요</p>
            </div>

            <div className="reveal float" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>

              {/* Left Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Upcoming */}
                <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span className="ms" style={{ color: '#1a4db2', fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>event_upcoming</span>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#181c1e' }}>다가오는 일정</span>
                  </div>
                  {[
                    { name: '알고리즘 수업', time: '09:00', tag: '오늘', tagBg: '#c3d0ff' },
                    { name: '과제 제출 마감', time: '14:00', tag: '오늘', tagBg: '#ffdcc6' },
                    { name: '스터디 그룹', time: '17:00', tag: '오늘', tagBg: '#c3d0ff' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f1f4f7' : 'none' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#1a4db2', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#181c1e' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#434653' }}>{item.time}</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: item.tagBg, color: '#1a4db2', padding: '2px 8px', borderRadius: '999px' }}>{item.tag}</span>
                    </div>
                  ))}
                </div>

                {/* AI Card */}
                <div style={{ background: '#1a4db2', borderRadius: '20px', padding: '24px', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="ms" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>psychology</span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>AI 인사이트</span>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.92 }}>
                    이번 주 공부 시간이 12% 증가했어요! 화요일 오후 빈 시간에 복습 세션을 추가해보세요.
                  </p>
                  <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    <span className="ms" style={{ fontSize: '14px' }}>add</span>
                    일정 추가
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(26,77,178,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontWeight: 700, color: '#181c1e' }}>이번 주 시간표</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#434653', fontSize: '14px' }}>
                    <span className="ms" style={{ fontSize: '18px', cursor: 'pointer' }}>chevron_left</span>
                    <span style={{ fontWeight: 600 }}>3월 4주</span>
                    <span className="ms" style={{ fontSize: '18px', cursor: 'pointer' }}>chevron_right</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {['월', '화', '수', '목', '금', '토'].map((d) => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#434653', padding: '4px 0' }}>{d}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
                  {[
                    [{ l: '수학', t: '9:00', c: '#c3d0ff', tc: '#1a4db2' }, { l: '자율학습', t: '14:00', c: '#f1f4f7', tc: '#434653' }],
                    [{ l: '영어', t: '10:00', c: '#ffdcc6', tc: '#8b4500' }, { l: '물리', t: '15:00', c: '#c3d0ff', tc: '#1a4db2' }],
                    [{ l: '화학', t: '9:00', c: '#c3d0ff', tc: '#1a4db2' }, { l: '국어', t: '13:00', c: '#ffdcc6', tc: '#8b4500' }],
                    [{ l: '수학', t: '11:00', c: '#c3d0ff', tc: '#1a4db2' }, { l: '복습', t: '16:00', c: '#f1f4f7', tc: '#434653' }],
                    [{ l: '영어', t: '9:00', c: '#ffdcc6', tc: '#8b4500' }, { l: '시험준비', t: '14:00', c: '#c3d0ff', tc: '#1a4db2' }],
                    [{ l: '자유', t: '10:00', c: '#f1f4f7', tc: '#434653' }],
                  ].map((col, ci) => (
                    <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {col.map((b, bi) => (
                        <div key={bi} style={{ background: b.c, color: b.tc, borderRadius: '10px', padding: '8px', fontSize: '12px', fontWeight: 600 }}>
                          {b.l}
                          <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.7, marginTop: '2px' }}>{b.t}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 기능 (Features) ── */}
        <section id="features" style={{ padding: '100px 24px', background: '#f7fafd' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

            <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '2px', background: '#1a4db2', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a4db2', letterSpacing: '2px', textTransform: 'uppercase' }}>기능</span>
            </div>

            <div className="reveal" style={{ marginBottom: '56px' }}>
              <h2 className="font-headline" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#181c1e', marginBottom: '12px' }}>
                더 스마트하게, 더 효율적으로
              </h2>
              <p style={{ fontSize: '16px', color: '#434653' }}>AI가 당신의 시간을 최적화합니다</p>
            </div>

            {/* Bento top row */}
            <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', border: '1px solid #ebeef1', boxShadow: '0 2px 12px rgba(26,77,178,0.05)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ebeef1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <span className="ms" style={{ color: '#1a4db2', fontVariationSettings: "'FILL' 1" }}>psychology_alt</span>
                </div>
                <h3 className="font-headline" style={{ fontSize: '20px', fontWeight: 800, color: '#181c1e', marginBottom: '10px' }}>예측형 스케줄링</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#434653' }}>
                  AI가 과거 패턴을 학습하여 최적의 공부 시간과 휴식 패턴을 예측하고 추천합니다. 개인화된 시간 관리로 생산성을 극대화하세요.
                </p>
              </div>
              <div style={{ background: '#1a4db2', borderRadius: '20px', padding: '36px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <span className="ms" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                </div>
                <div>
                  <h3 className="font-headline" style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>자동 동기화</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, opacity: 0.9 }}>모든 기기에서 실시간으로 동기화되어 언제 어디서나 최신 일정을 확인하세요.</p>
                </div>
              </div>
            </div>

            {/* Feature cards bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { icon: 'chat', title: 'AI 자연어 입력', desc: '"매주 월요일 오전 9시에 수학 수업 추가해줘"처럼 자연어로 일정을 관리하세요.', bg: '#ebeef1', iconBg: '#ebeef1', iconColor: '#1a4db2' },
                { icon: 'calendar_view_week', title: '시각적 시간표', desc: '7일 그리드 형태의 직관적인 시간표로 한눈에 일정을 파악하고 관리하세요.', bg: '#fff', iconBg: '#ffdcc6', iconColor: '#8b4500' },
                { icon: 'quiz', title: '시험 일정 관리', desc: '다가오는 시험 일정을 등록하고 남은 기간을 확인하며 효율적으로 준비하세요.', bg: '#fff', iconBg: '#c3d0ff', iconColor: '#1a4db2' },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`reveal d-${i + 1}`}
                  style={{ background: card.bg, borderRadius: '20px', padding: '28px', border: '1px solid #ebeef1', boxShadow: '0 2px 10px rgba(26,77,178,0.05)', transition: 'transform 0.25s, box-shadow 0.25s' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <span className="ms" style={{ color: card.iconColor, fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  </div>
                  <h3 className="font-headline" style={{ fontSize: '17px', fontWeight: 800, color: '#181c1e', marginBottom: '8px' }}>{card.title}</h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#434653' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ padding: '80px 24px', background: '#1a4db2' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
            <h2 className="font-headline reveal" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, marginBottom: '16px' }}>
              지금 바로 시작하세요
            </h2>
            <p className="reveal" style={{ fontSize: '16px', opacity: 0.85, marginBottom: '32px', lineHeight: 1.7 }}>
              SKEMA와 함께 더 체계적이고 스마트한 하루를 설계하세요.
            </p>
            <Link href="/register" className="reveal" style={{ display: 'inline-block', background: '#fff', color: '#1a4db2', padding: '14px 36px', borderRadius: '999px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}>
              무료로 시작하기
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: '#ebeef1', padding: '48px 24px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#1a4db2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="ms" style={{ fontSize: '15px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  </div>
                  <span className="font-headline" style={{ fontWeight: 800, fontSize: '17px', color: '#181c1e' }}>SKEMA</span>
                </div>
                <p style={{ fontSize: '13px', color: '#434653', lineHeight: 1.6 }}>AI 기반 스마트 시간표 관리 서비스</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '13px', color: '#181c1e', marginBottom: '12px' }}>서비스</h4>
                {['시간표 관리', 'AI 일정 추천', '시험 준비'].map((t) => (
                  <div key={t} style={{ fontSize: '13px', color: '#434653', marginBottom: '8px' }}>{t}</div>
                ))}
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '13px', color: '#181c1e', marginBottom: '12px' }}>지원</h4>
                {['이용약관', '개인정보처리방침', '문의하기'].map((t) => (
                  <div key={t} style={{ fontSize: '13px', color: '#434653', marginBottom: '8px' }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #d0d3d6', paddingTop: '24px', textAlign: 'center', fontSize: '13px', color: '#434653' }}>
              © 2026 SKEMA. AI 기반 시간 설계 서비스
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
