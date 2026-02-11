
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import DashboardPage from './DashboardPage';
import OnboardingPage from './OnboardingPage';
import ForgotPasswordPage from './ForgotPasswordPage';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showLogin, showSignup]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleAuth = (u: any) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleOnboardingComplete = (data: any) => {
    const updatedUser = { ...user, ...data, onboarded: true };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const openLogin = () => { setShowLogin(true); setShowSignup(false); };
  const openSignup = () => { setShowSignup(true); setShowLogin(false); };
  const closeModals = () => { setShowLogin(false); setShowSignup(false); };

  return (
    <HashRouter>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-dark' : 'bg-slate-50'}`}>
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          onLogout={handleLogout}
          onLoginClick={openLogin}
          onSignupClick={openSignup}
        />
        
        <main className={`selection-blue transition-all duration-500 ${(showLogin || showSignup) ? 'blur-md scale-[0.98]' : ''}`}>
          <Routes>
            <Route path="/" element={<LandingPage onSignupClick={openSignup} />} />
            <Route path="/onboarding" element={<OnboardingPage user={user} onComplete={handleOnboardingComplete} />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Modals Overlays */}
        {showLogin && (
          <LoginPage 
            onLogin={handleAuth} 
            onClose={closeModals} 
            onSwitchToSignup={openSignup}
          />
        )}
        {showSignup && (
          <SignupPage 
            onSignup={handleAuth} 
            onClose={closeModals} 
            onSwitchToLogin={openLogin}
          />
        )}
      </div>
    </HashRouter>
  );
}
