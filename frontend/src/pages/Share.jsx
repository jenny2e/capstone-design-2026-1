import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Timetable from '../components/Timetable/Timetable';
import { getSharedTimetable } from '../services/api';

export default function Share() {
  const { token } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    getSharedTimetable(token)
      .then((res) => setSchedules(res.data))
      .catch((err) =>
        setError(err.response?.data?.detail || '시간표를 불러올 수 없습니다.')
      )
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F3FF' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #6366F1, #7C3AED)',
          backgroundImage: 'linear-gradient(135deg, #4F46E5, #6366F1, #7C3AED)',
          padding: '0 20px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📅</span>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'white' }}>
            공유된 시간표
          </span>
        </div>
        <a
          href="/"
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
          style={{
            fontSize: 13,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            padding: '6px 14px',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 20,
            background: linkHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
            transition: 'background 0.15s',
          }}
        >
          내 시간표 만들기 →
        </a>
      </header>

      <main style={{ maxWidth: 1000, margin: '24px auto', padding: '0 20px' }}>
        {loading ? (
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 40,
              textAlign: 'center',
              color: '#7C73C0',
              border: '1px solid #E4E1F7',
              boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
            }}
          >
            불러오는 중...
          </div>
        ) : error ? (
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 40,
              textAlign: 'center',
              color: '#EF4444',
              border: '1px solid #E4E1F7',
              fontSize: 15,
              boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
            }}
          >
            {error}
          </div>
        ) : (
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid #E4E1F7',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(99,102,241,0.12)',
            }}
          >
            <Timetable schedules={schedules} />
          </div>
        )}
      </main>
    </div>
  );
}
