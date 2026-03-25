'use client';
import Link from 'next/link';
import MaterialIcon from '@/components/common/MaterialIcon';

interface AuthNavbarProps {
  /** 'login' shows 회원가입 button, 'register' shows 로그인 button */
  mode: 'login' | 'register';
}

export default function AuthNavbar({ mode }: AuthNavbarProps) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(247,250,253,0.90)', backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--skema-container)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--skema-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcon icon="schedule" size={17} color="#fff" filled />
          </div>
          <span className="skema-headline" style={{ fontWeight: 800, fontSize: '20px', color: 'var(--skema-on-surface)' }}>SKEMA</span>
        </Link>
        {mode === 'login' ? (
          <Link href="/register" style={{ fontSize: '14px', fontWeight: 700, color: '#fff', background: 'var(--skema-primary-hover)', padding: '8px 22px', borderRadius: '999px', textDecoration: 'none' }}>
            회원가입
          </Link>
        ) : (
          <Link href="/login" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--skema-primary)', background: 'transparent', padding: '8px 22px', borderRadius: '999px', textDecoration: 'none', border: '1.5px solid var(--skema-secondary-container)' }}>
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
