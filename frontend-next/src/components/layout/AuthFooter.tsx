import MaterialIcon from '@/components/common/MaterialIcon';

export default function AuthFooter() {
  return (
    <footer style={{ background: 'var(--skema-container)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--skema-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcon icon="schedule" size={15} color="#fff" filled />
              </div>
              <span className="skema-headline" style={{ fontWeight: 800, fontSize: '17px', color: 'var(--skema-on-surface)' }}>SKEMA</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--skema-on-surface-variant)', lineHeight: 1.6 }}>AI 기반 스마트 시간표 관리 서비스</p>
          </div>
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--skema-primary)', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginBottom: '12px' }}>서비스</h4>
            {['이용약관', '개인정보처리방침', '고객센터'].map((t) => (
              <div key={t} style={{ fontSize: '13px', color: '#44474a', marginBottom: '8px', cursor: 'pointer' }}>{t}</div>
            ))}
          </div>
          <div style={{ background: 'rgba(224,227,230,0.5)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--skema-on-surface-variant)', fontStyle: 'italic', lineHeight: 1.6 }}>
              &ldquo;한 번에 하나씩 집중하는 것이 많은 일을 해내는 가장 빠른 방법입니다.&rdquo;
            </p>
            <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
              {['alarm_on', 'schedule', 'event_available'].map((icon) => (
                <MaterialIcon key={icon} icon={icon} size={22} color="var(--skema-primary-hover)" filled />
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #d0d3d6', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--skema-outline-strong)' }}>
          © 2026 SKEMA. AI 기반 시간 설계 서비스
        </div>
      </div>
    </footer>
  );
}
