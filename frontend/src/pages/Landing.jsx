import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_SCHEDULES = {
  mon: [{ title: '알고리즘', time: '09:00 - 10:30', color: '#1a4db2', urgent: false }],
  tue: [
    { title: '자료구조', time: '10:00 - 11:30', color: '#1a4db2', urgent: false },
    { title: 'AI 최적 학습', time: '13:00 - 14:00', color: null, ai: true },
    { title: '점심 휴식', time: '12:00 - 13:00', color: null, rest: true },
  ],
  wed: [{ title: '프로젝트 미팅', time: '14:00 - 15:00', color: '#10B981', urgent: false }],
  thu: [{ title: '운영체제', time: '09:00 - 10:30', color: '#8B5CF6', urgent: false }],
  fri: [{ title: '캡스톤 설계', time: '13:00 - 15:00', color: '#F59E0B', urgent: false }],
  sat: [],
};

export default function Landing() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = ['preview', 'about', 'features'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -50% 0px' }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const navLink = (id, label) => (
    <a
      href={`#${id}`}
      onClick={() => setActiveSection(id)}
      style={{
        color: activeSection === id ? '#1a4db2' : '#434653',
        fontWeight: activeSection === id ? 700 : 500,
        fontSize: 14,
        textDecoration: 'none',
        borderBottom: activeSection === id ? '2px solid #1a4db2' : '2px solid transparent',
        paddingBottom: 2,
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#1a4db2'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = activeSection === id ? '#1a4db2' : '#434653'; }}
    >
      {label}
    </a>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd', fontFamily: "'Inter', sans-serif" }}>
      {/* ===== Navbar ===== */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(247,250,253,0.88)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(195,198,213,0.25)',
        boxShadow: '0 1px 3px rgba(24,28,30,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: '#181c1e', letterSpacing: '-0.4px' }}>
            SKEMA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLink('features', '기능')}
            {navLink('preview', '미리보기')}
            {navLink('about', '소개')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate('/login')}
              style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(195,198,213,0.6)', borderRadius: 9999, color: '#434653', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#ebeef1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/login?mode=register')}
              style={{ padding: '8px 20px', background: '#1a4db2', border: 'none', borderRadius: 9999, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(26,77,178,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              시작하기
            </button>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 64 }}>
        {/* ===== Hero Section ===== */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 96px', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, background: '#c3d0ff', color: '#38456c', marginBottom: 28 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif" }}>AI 기반 스마트 일정 관리</span>
          </div>

          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.1, color: '#181c1e', marginBottom: 24, letterSpacing: '-1px', maxWidth: 900, margin: '0 auto 24px' }}>
            AI로 완벽한<br />일상을 설계하세요
          </h1>
          <p style={{ fontSize: 18, color: '#434653', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.75 }}>
            자연어로 일정을 말하면 AI가 알아서 시간표를 만들어 드립니다. 수면 패턴, 시험 일정까지 고려한 나만의 스케줄.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login?mode=register')}
              style={{ padding: '16px 36px', background: '#1a4db2', color: '#fff', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 28px rgba(26,77,178,0.32)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            >
              무료로 시작하기
            </button>
            <a
              href="#preview"
              style={{ padding: '16px 36px', background: '#e0e3e6', color: '#1a4db2', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textDecoration: 'none', transition: 'background 0.2s', display: 'inline-block' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#d7dadd'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e0e3e6'; }}
            >
              미리보기
            </a>
          </div>
        </section>

        {/* ===== Timetable Preview Section ===== */}
        <section id="preview" style={{ background: '#f1f4f7', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {/* Section header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, gap: 24, flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 480 }}>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 34, color: '#181c1e', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
                  나만의 스마트 캔버스
                </h2>
                <p style={{ fontSize: 15, color: '#434653', margin: 0, lineHeight: 1.6 }}>
                  AI가 인지 부하와 우선순위를 분석해 최적의 일정을 동적으로 조정합니다.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, background: '#f7fafd', padding: 4, borderRadius: 12 }}>
                <div style={{ padding: '7px 16px', borderRadius: 9, background: '#1a4db2', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'default' }}>주간 보기</div>
                <div style={{ padding: '7px 16px', borderRadius: 9, color: '#747684', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>일간</div>
              </div>
            </div>

            {/* Dashboard bento grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
              {/* Sidebar */}
              <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Upcoming card */}
                <div style={{ background: '#fff', padding: 22, borderRadius: 16, boxShadow: '0 2px 12px rgba(24,28,30,0.06)', border: '1px solid rgba(195,198,213,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 20 }}>notifications</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: '#181c1e' }}>다가오는 일정</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(59,102,204,0.06)', borderLeft: '4px solid #1a4db2' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1a4db2', marginBottom: 3 }}>15분 후</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#181c1e' }}>알고리즘 강의</div>
                      <div style={{ fontSize: 11, color: '#747684', marginTop: 1 }}>공학관 B • 10:00 AM</div>
                    </div>
                    <div style={{ padding: '12px 14px', borderRadius: 12, background: '#ebeef1' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#747684', marginBottom: 3 }}>1:30 PM</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#181c1e' }}>AI 연구 미팅</div>
                      <div style={{ fontSize: 11, color: '#747684', marginTop: 1 }}>본관 402호</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights card */}
                <div style={{ background: '#fff', padding: 22, borderRadius: 16, boxShadow: '0 2px 12px rgba(24,28,30,0.06)', border: '1px solid rgba(195,198,213,0.2)' }}>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: '#181c1e', marginBottom: 14 }}>AI 인사이트</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#ffdcc6', color: '#723600' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1", flexShrink: 0, marginTop: 1 }}>bolt</span>
                    <p style={{ fontSize: 12, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>오전 10:30에 집중력 피크 감지. 복잡한 과제를 이 시간에 배치하세요.</p>
                  </div>
                </div>
              </div>

              {/* Main calendar */}
              <div style={{ gridColumn: 'span 9' }}>
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(24,28,30,0.06)', border: '1px solid rgba(195,198,213,0.2)' }}>
                  {/* Calendar header */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid rgba(195,198,213,0.2)', background: '#f7fafd' }}>
                    {[['월', '14', false], ['화', '15', true], ['수', '16', false], ['목', '17', false], ['금', '18', false], ['토', '19', false]].map(([day, date, isActive]) => (
                      <div key={day} style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid rgba(195,198,213,0.15)', background: isActive ? 'rgba(26,77,178,0.04)' : 'transparent' }}>
                        <span style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: isActive ? '#1a4db2' : '#747684', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{day}</span>
                        <span style={{ fontSize: 20, fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: isActive ? '#1a4db2' : '#181c1e' }}>{date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar body */}
                  <div style={{ padding: 16, minHeight: 320 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, height: '100%' }}>
                      {/* Mon */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(195,208,255,0.3)', color: '#505d85', fontSize: 12, fontWeight: 600 }}>
                          <div>알고리즘</div>
                          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>09:00-10:30</div>
                        </div>
                      </div>
                      {/* Tue */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: '#1a4db2', color: '#fff', boxShadow: '0 4px 12px rgba(26,77,178,0.25)' }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>알고리즘</div>
                          <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>10:00 - 11:30</div>
                        </div>
                        <div style={{ padding: '10px 12px', borderRadius: 12, border: '2px dashed rgba(132,64,0,0.25)', background: 'rgba(255,220,198,0.2)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#844000', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#844000' }}>AI 최적 학습</span>
                          </div>
                          <span style={{ fontSize: 10, color: '#723600' }}>AI 추천 슬롯</span>
                        </div>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: '#e5e8eb', color: '#434653', fontSize: 12, fontWeight: 500 }}>
                          점심 휴식
                        </div>
                      </div>
                      {/* Wed */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(16,185,129,0.12)', color: '#059669', fontSize: 12, fontWeight: 600 }}>
                          <div>프로젝트 미팅</div>
                          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>14:00-15:00</div>
                        </div>
                      </div>
                      {/* Thu */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: '#1a4db2', color: '#fff' }}>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>운영체제</div>
                          <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>09:00-10:30</div>
                        </div>
                      </div>
                      {/* Fri */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(245,158,11,0.12)', color: '#92400e', fontSize: 12, fontWeight: 600 }}>
                          <div>캡스톤 설계</div>
                          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>13:00-15:00</div>
                        </div>
                      </div>
                      {/* Sat */}
                      <div />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== About / Etymology Section ===== */}
        <section id="about" style={{ background: '#fff', padding: '96px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {/* Top label */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 9999, background: '#ebeef1', marginBottom: 48 }}>
              <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 16 }}>history_edu</span>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#434653', fontFamily: "'Inter', sans-serif" }}>이름의 이야기</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              {/* Left: etymology visual */}
              <div>
                {/* Word breakdown */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 72, color: '#1a4db2', letterSpacing: '-2px', lineHeight: 1 }}>SK</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 72, color: '#e0e3e6', letterSpacing: '-2px', lineHeight: 1 }}>EMA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ height: 2, width: 40, background: '#1a4db2', borderRadius: 1 }} />
                    <span style={{ fontSize: 13, color: '#747684', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em' }}>from <strong style={{ color: '#181c1e' }}>Scheme</strong> · <em>σχῆμα</em> (Greek)</span>
                  </div>
                </div>

                {/* Etymology cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { lang: 'Greek', word: 'σχῆμα (schéma)', meaning: '형태, 모양, 구조 — form, figure, plan' },
                    { lang: 'English', word: 'Scheme', meaning: '체계, 계획, 구성 — a systematic arrangement' },
                    { lang: 'SKEMA', word: 'SKEMA', meaning: '나만의 삶의 체계를 설계한다' },
                  ].map(({ lang, word, meaning }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px', borderRadius: 14, background: i === 2 ? '#1a4db2' : '#f7fafd', border: `1px solid ${i === 2 ? 'transparent' : 'rgba(195,198,213,0.3)'}` }}>
                      <div style={{ width: 56, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 2 ? 'rgba(255,255,255,0.6)' : '#747684', fontFamily: "'Inter', sans-serif" }}>{lang}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, color: i === 2 ? '#fff' : '#181c1e', marginBottom: 3 }}>{word}</div>
                        <div style={{ fontSize: 13, color: i === 2 ? 'rgba(255,255,255,0.75)' : '#434653', lineHeight: 1.5 }}>{meaning}</div>
                      </div>
                      {i < 2 && (
                        <div style={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'center' }}>
                          <span className="material-symbols-outlined" style={{ color: '#c3c6d5', fontSize: 18 }}>arrow_downward</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: brand story */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 36, color: '#181c1e', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                    우리가 만들고 싶었던 것
                  </h2>
                  <p style={{ fontSize: 16, color: '#434653', margin: 0, lineHeight: 1.8 }}>
                    매 학기마다 반복되는 고민이 있었습니다. <strong style={{ color: '#181c1e' }}>시간표는 있는데, 내 삶은 없다.</strong> 수업 시간을 채워 넣는 건 쉽지만, 그 사이사이에 공부 시간, 휴식, 운동, 수면을 어떻게 배치해야 할지는 언제나 막막했습니다.
                  </p>
                </div>

                <div style={{ width: '100%', height: 1, background: '#ebeef1' }} />

                <p style={{ fontSize: 16, color: '#434653', margin: 0, lineHeight: 1.8 }}>
                  <strong style={{ color: '#1a4db2' }}>SKEMA</strong>는 그리스어 <em>σχῆμα</em>에서 온 말로, 단순한 '계획표'를 넘어 <strong style={{ color: '#181c1e' }}>삶의 체계</strong>를 의미합니다. 우리는 AI가 단순히 일정을 등록하는 도구가 아닌, 사용자의 수면 패턴·시험 일정·생활 리듬을 이해하고 스스로 최적의 구조를 제안해 주는 동반자가 되길 원했습니다.
                </p>

                <p style={{ fontSize: 16, color: '#434653', margin: 0, lineHeight: 1.8 }}>
                  "내일 3시에 팀 미팅 추가해줘"라고 말하는 것만으로 시간표가 완성되고, AI가 남은 빈 시간에 학습 블록과 휴식을 배치해 주는 세상. 그것이 SKEMA가 꿈꾸는 일상입니다.
                </p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                  {['AI 자연어 처리', '수면 패턴 반영', '시험 일정 관리', '스마트 공유'].map((tag) => (
                    <span key={tag} style={{ padding: '6px 14px', background: '#ebeef1', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: '#434653', fontFamily: "'Inter', sans-serif" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Features Section ===== */}
        <section id="features" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 36, color: '#181c1e', margin: '0 0 12px', letterSpacing: '-0.5px' }}>왜 SKEMA인가요?</h2>
            <p style={{ fontSize: 16, color: '#434653', margin: 0 }}>복잡한 일정 관리를 AI가 대신 해드립니다.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* Feature 1: large */}
            <div style={{ gridColumn: 'span 2', background: '#ebeef1', padding: 40, borderRadius: 20, position: 'relative', overflow: 'hidden', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', top: 24, right: 24, width: 80, height: 80, borderRadius: 20, background: 'rgba(26,77,178,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 40 }}>psychology</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 26, color: '#181c1e', margin: '0 0 10px' }}>예측형 스케줄링</h3>
                <p style={{ fontSize: 15, color: '#434653', margin: 0, maxWidth: 440, lineHeight: 1.65 }}>AI가 생활 패턴, 에너지 레벨, 집중력 사이클을 학습해 실제로 지킬 수 있는 시간표를 만들어 드립니다.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ background: '#1a4db2', padding: 36, borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280 }}>
              <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 40, fontVariationSettings: "'wght' 200" }}>chat</span>
              <div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', margin: '0 0 8px' }}>자연어 입력</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>"내일 3시에 팀 미팅 추가해줘" — 말하듯 입력하면 AI가 알아서 등록합니다.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ background: '#fff', padding: 36, borderRadius: 20, border: '1px solid rgba(195,198,213,0.3)', boxShadow: '0 2px 12px rgba(24,28,30,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
              <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 36 }}>share</span>
              <div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: '#181c1e', margin: '12px 0 6px' }}>링크로 공유</h3>
                <p style={{ fontSize: 14, color: '#434653', margin: 0, lineHeight: 1.6 }}>내 시간표를 링크 하나로 친구·팀원과 공유하세요.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div style={{ background: '#fff', padding: 36, borderRadius: 20, border: '1px solid rgba(195,198,213,0.3)', boxShadow: '0 2px 12px rgba(24,28,30,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
              <span className="material-symbols-outlined" style={{ color: '#1a4db2', fontSize: 36 }}>bedtime</span>
              <div>
                <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: '#181c1e', margin: '12px 0 6px' }}>수면 패턴 반영</h3>
                <p style={{ fontSize: 14, color: '#434653', margin: 0, lineHeight: 1.6 }}>취침·기상 시간을 설정하면 AI가 수면을 침범하지 않는 일정을 만듭니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section style={{ background: '#1a4db2', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 38, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              지금 바로 시작해보세요
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', margin: '0 0 36px', lineHeight: 1.65 }}>
              무료로 계정을 만들고 SKEMA의 모든 기능을 이용하세요.
            </p>
            <button
              onClick={() => navigate('/login?mode=register')}
              style={{ padding: '16px 44px', background: '#fff', color: '#1a4db2', border: 'none', borderRadius: 9999, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 28px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.filter = 'brightness(0.97)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
            >
              무료로 시작하기
            </button>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer id="footer" style={{ background: '#ebeef1', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, color: '#181c1e' }}>SKEMA</div>
            <p style={{ fontSize: 13, color: '#434653', margin: 0, lineHeight: 1.6 }}>AI로 설계하는 나만의 하루.</p>
            <p style={{ fontSize: 12, color: '#747684', margin: 0 }}>© 2026 SKEMA. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#181c1e', fontFamily: "'Inter', sans-serif" }}>서비스</span>
            {['기능 소개', '사용 가이드', 'API'].map((item) => (
              <a key={item} href="#" style={{ fontSize: 13, color: '#434653', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1a4db2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#434653'; }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#181c1e', fontFamily: "'Inter', sans-serif" }}>법적 정보</span>
            {['개인정보처리방침', '이용약관', '고객센터'].map((item) => (
              <a key={item} href="#" style={{ fontSize: 13, color: '#434653', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1a4db2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#434653'; }}>
                {item}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#181c1e', fontFamily: "'Inter', sans-serif" }}>소셜</span>
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {['public', 'share'].map((icon) => (
                <a key={icon} href="#" style={{ color: '#434653', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1a4db2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#434653'; }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
