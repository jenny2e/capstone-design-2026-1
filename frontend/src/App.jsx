import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Share from './pages/Share';
import { getMe, getProfile } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      Promise.all([getMe(), getProfile()])
        .then(([userRes, profileRes]) => {
          setUser(userRes.data);
          setProfile(profileRes.data);
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    const [userRes, profileRes] = await Promise.all([getMe(), getProfile()]);
    setUser(userRes.data);
    setProfile(profileRes.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const handleOnboardingComplete = async () => {
    const profileRes = await getProfile();
    setProfile(profileRes.data);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F3FF',
          color: '#7C73C0',
          fontSize: 16,
        }}
      >
        로딩 중...
      </div>
    );
  }

  // Not logged in → only /login and /share routes
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/share/:token" element={<Share />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Logged in but onboarding not completed
  if (profile && !profile.onboarding_completed) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/share/:token" element={<Share />} />
        <Route
          path="/"
          element={
            <Home
              user={user}
              profile={profile}
              onLogout={handleLogout}
              onProfileUpdate={setProfile}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
