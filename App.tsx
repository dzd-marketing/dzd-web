import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import DashboardPage from './DashboardPage';
import OnboardingPage from './OnboardingPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import SupportView from './Support';
import HowToUseView from './HowToUseView';
import ArticleView from './ArticleView';
import CategoryView from './CategoryView';
import WalletPage from './wallet/BillingPageView';
import ContactPage from './Contact';
import TermsofServicePage from './TermsofService';
import AboutUsPage from './AboutUs';
import AIChatWidget from './AiChatWidget';
import PricingPage from './PricingPage';
import Footer from './Footer';

// Loading Spinner Component with inline styles
const LoadingSpinner = () => {
  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        @keyframes pulse-premium {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .animate-pulse-premium {
          animation: pulse-premium 2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 bg-[#0a0a0a] z-[9999] flex items-center justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin-slow"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 w-28 h-28 rounded-full border-2 border-transparent border-b-purple-500 border-l-pink-500 animate-spin-slow animation-delay-150"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-4 w-24 h-24 rounded-full border-2 border-transparent border-t-pink-500 border-r-blue-500 animate-spin-slow animation-delay-300"></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-premium"></div>
          </div>
        </div>
      </div>
    </>
  );
};

// Anti-DevTools Component
const AntiDevTools = ({ children }: { children: React.ReactNode }) => {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const warningShownRef = React.useRef(false);

  useEffect(() => {
    // Function to detect devtools
    const detectDevTools = () => {
      const start = performance.now();
      debugger; // This will pause execution if devtools is open
      const end = performance.now();
      
      // If the debugger caused a significant delay (>100ms), devtools is likely open
      if (end - start > 100) {
        if (!warningShownRef.current) {
          setShowWarning(true);
          warningShownRef.current = true;
          setDevToolsOpen(true);
        }
        return true;
      }
      return false;
    };

    // Function to handle right click
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      if (!warningShownRef.current) {
        setShowWarning(true);
        warningShownRef.current = true;
        setDevToolsOpen(true);
      }
      return false;
    };

    // Function to handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for devtools shortcuts
      const isDevToolsShortcut = 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.key === 'U' || e.key === 'u') || // Ctrl+U (view source)
        (e.key === 'F12') || // F12
        (e.metaKey && e.altKey && e.key === 'I' || e.key === 'i'); // Cmd+Option+I (Mac)

      if (isDevToolsShortcut) {
        e.preventDefault();
        if (!warningShownRef.current) {
          setShowWarning(true);
          warningShownRef.current = true;
          setDevToolsOpen(true);
        }
      }
    };

    // Function to check devtools periodically
    const checkDevToolsInterval = setInterval(() => {
      detectDevTools();
      
      // Additional detection methods
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if ((widthThreshold || heightThreshold) && !warningShownRef.current) {
        setShowWarning(true);
        warningShownRef.current = true;
        setDevToolsOpen(true);
      }
    }, 1000);

    // Add event listeners
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // Also prevent text selection via CSS
    document.documentElement.style.userSelect = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
    document.documentElement.style.msUserSelect = 'none';
    document.documentElement.style.mozUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(checkDevToolsInterval);
      
      // Reset styles on unmount
      document.documentElement.style.userSelect = '';
      document.documentElement.style.webkitUserSelect = '';
      document.documentElement.style.msUserSelect = '';
      document.documentElement.style.mozUserSelect = '';
    };
  }, []);

  // Function to handle refresh - only way to close warning
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {/* DevTools Warning Overlay */}
      {showWarning && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Full screen image overlay */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img 
              src="/devtools-warning.jpg" // Make sure this image exists in your public folder
              alt="Developer Tools Detected"
              className="w-full h-full object-cover"
            />
            
            {/* Optional overlay text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
              <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl max-w-md mx-4 text-center border border-red-500/30">
                <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
                  ⚠️ Developer Tools Detected
                </h1>
                <p className="text-gray-300 mb-6 text-sm font-bold uppercase tracking-wider">
                  For security reasons, developer tools are not allowed on this website.
                  <br />
                  <br />
                  Please refresh the page to continue.
                </p>
                <button
                  onClick={handleRefresh}
                  className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest text-sm transition-all transform hover:scale-105 shadow-2xl shadow-red-600/30"
                >
                  Refresh Page
                </button>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-4">
                  This warning cannot be closed until page refresh
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Your app content */}
      {children}
    </>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    setTimeout(() => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
      
      document.querySelectorAll('.overflow-y-auto, .no-scrollbar').forEach(el => {
        el.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      });
    }, 50);
  }, [pathname]);

  return null;
}

function useNavigationLoader(delay = 300) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return loading;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const handleOnboardingComplete = (data: any) => {
    const updatedUser = { ...user, ...data, onboarded: true };
    setUser(updatedUser);
  };

  const openLogin = () => { setShowLogin(true); setShowSignup(false); };
  const openSignup = () => { setShowSignup(true); setShowLogin(false); };
  const closeModals = () => { setShowLogin(false); setShowSignup(false); };

  // Initial load spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  const AppContent = () => {
    const navigationLoading = useNavigationLoader(500);

    return (
      <AntiDevTools>
        <ScrollToTop />
        {/* Navigation spinner */}
        {navigationLoading && <LoadingSpinner />}
        
        <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'dark bg-dark' : 'bg-slate-50'}`}>
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            user={user}
            onLogout={handleLogout}
            onLoginClick={openLogin}
            onSignupClick={openSignup}
          />

          <main className={`selection-blue transition-all duration-300 ${(showLogin || showSignup) ? 'blur-[8px] scale-[0.99] opacity-50 pointer-events-none' : ''}`}>
            <Routes>
              <Route path="/" element={<LandingPage onSignupClick={openSignup} />} />
              <Route path="/onboarding" element={<OnboardingPage user={user} onComplete={handleOnboardingComplete} />} />
              <Route path="/dashboard/*" element={<DashboardPage user={user} />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/support" element={<SupportView />} />
              <Route path="/support/how-to-use" element={<HowToUseView />} />
              <Route path="/support/article/:slug" element={<ArticleView />} />
              <Route path="/support/category/:categorySlug" element={<CategoryView />} />
              <Route path="/wallet" element={<WalletPage user={user} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms-of-service" element={<TermsofServicePage />} />
              <Route path="/about-us" element={<AboutUsPage onSignupClick={openSignup} />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/pricing" element={<PricingPage onSignupClick={openSignup} />} />
            </Routes>
          </main>

          <AIChatWidget />
          <Footer user={user} onSignupClick={openSignup} />

          {showLogin && (
            <LoginPage onLogin={handleAuth} onClose={closeModals} onSwitchToSignup={openSignup} />
          )}
          {showSignup && (
            <SignupPage onSignup={handleAuth} onClose={closeModals} onSwitchToLogin={openLogin} />
          )}
        </div>
      </AntiDevTools>
    );
  };

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
