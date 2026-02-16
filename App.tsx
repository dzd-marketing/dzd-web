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
import WaBoost from './waboost/WhatsAppBoostView';

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

// Anti-DevTools Component - Maximum Security (No Pause, No Escape)
const AntiDevTools = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const securityRef = React.useRef({
    detected: false,
    redirecting: false,
    blocked: false
  });

  useEffect(() => {
    // Detect mobile first
    const checkMobile = () => {
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(mobile);
      return mobile;
    };
    
    const isMobileDevice = checkMobile();
    if (isMobileDevice) return; // Skip all security on mobile

    // CRITICAL: Override debugger BEFORE anything else
    const overrideDebugger = () => {
      // Override Function constructor to prevent debugger creation
      const originalFunction = window.Function;
      window.Function = function(...args: any[]) {
        const code = args[args.length - 1];
        if (typeof code === 'string' && code.includes('debugger')) {
          args[args.length - 1] = '/* blocked */';
        }
        return originalFunction.apply(this, args);
      } as any;

      // Override eval to block debugger
      const originalEval = window.eval;
      window.eval = function(code: string) {
        if (typeof code === 'string' && code.includes('debugger')) {
          return '/* blocked */';
        }
        return originalEval(code);
      };

      // Block new Function debugger
      const originalNewFunction = Function.prototype.constructor;
      Function.prototype.constructor = function(...args: any[]) {
        const code = args[args.length - 1];
        if (typeof code === 'string' && code.includes('debugger')) {
          args[args.length - 1] = '/* blocked */';
        }
        return originalNewFunction.apply(this, args);
      };
    };

    // IMMEDIATE PAGE BLOCK FUNCTION
    const blockPageImmediately = () => {
      if (securityRef.current.blocked) return;
      securityRef.current.blocked = true;
      securityRef.current.detected = true;
      
      try {
        // Clear everything
        document.documentElement.innerHTML = '';
        document.body.innerHTML = '';
        
        // Create new document structure
        const html = document.documentElement;
        const head = document.createElement('head');
        const body = document.createElement('body');
        
        // Add meta tags to prevent any navigation
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Cache-Control';
        meta.content = 'no-cache, no-store, must-revalidate';
        head.appendChild(meta);
        
        const meta2 = document.createElement('meta');
        meta2.httpEquiv = 'Pragma';
        meta2.content = 'no-cache';
        head.appendChild(meta2);
        
        const meta3 = document.createElement('meta');
        meta3.httpEquiv = 'Expires';
        meta3.content = '0';
        head.appendChild(meta3);
        
        // Create fullscreen image
        const img = document.createElement('img');
        img.src = 'https://www.dzd-marketing.site/dzd-preview.png';
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100vw';
        img.style.height = '100vh';
        img.style.objectFit = 'cover';
        img.style.zIndex = '999999999';
        img.style.pointerEvents = 'none';
        
        body.appendChild(img);
        html.appendChild(head);
        html.appendChild(body);
        
        // CRITICAL: Override all navigation
        window.onbeforeunload = () => {
          return false;
        };
        
        // Block all history changes
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
          // Redirect to image URL instead
          window.location.replace('https://www.dzd-marketing.site/dzd-preview.png');
          return originalPushState.apply(this, arguments as any);
        };
        
        history.replaceState = function() {
          window.location.replace('https://www.dzd-marketing.site/dzd-preview.png');
          return originalReplaceState.apply(this, arguments as any);
        };
        
        // Force redirect every millisecond
        setInterval(() => {
          if (!securityRef.current.redirecting) {
            securityRef.current.redirecting = true;
            window.location.replace('https://www.dzd-marketing.site/dzd-preview.png');
          }
        }, 1);
        
      } catch (e) {
        // If block fails, force redirect
        window.location.replace('https://www.dzd-marketing.site/dzd-preview.png');
      }
    };

    // DETECTION METHODS (Non-blocking)
    const detectAndBlock = () => {
      if (securityRef.current.detected) return true;

      // Method 1: Dimension check (fastest)
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > 150 || heightDiff > 150) {
        blockPageImmediately();
        return true;
      }

      // Method 2: Console check (no pause)
      try {
        if (console && (console as any).firebug) {
          blockPageImmediately();
          return true;
        }
      } catch (e) {}

      // Method 3: Performance check (no debugger)
      const start = performance.now();
      const check = new Error().stack;
      const end = performance.now();
      
      if (end - start > 10) {
        blockPageImmediately();
        return true;
      }

      // Method 4: Check for devtools via toString
      try {
        const element = document.createElement('div');
        element.__defineGetter__('id', function() {
          blockPageImmediately();
          return '';
        });
        console.log(element);
      } catch (e) {}

      return false;
    };

    // Run detection BEFORE anything loads
    const runPreemptiveDetection = () => {
      // Override debugger first
      overrideDebugger();
      
      // Run detection in a tight loop (no pauses)
      for (let i = 0; i < 100; i++) {
        if (detectAndBlock()) break;
      }
      
      // Keep detecting continuously
      const interval = setInterval(() => {
        if (!securityRef.current.detected) {
          detectAndBlock();
        }
      }, 10); // Check every 10ms
      
      return interval;
    };

    // Start detection
    const detectionInterval = runPreemptiveDetection();

    // Block all input events
    const blockAllEvents = (e: Event) => {
      if (securityRef.current.detected) return;
      
      // Block right click
      if (e.type === 'contextmenu') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // Block keyboard shortcuts
      if (e.type === 'keydown') {
        const ke = e as KeyboardEvent;
        if (
          ke.key === 'F12' ||
          (ke.ctrlKey && ke.shiftKey && ke.key === 'I') ||
          (ke.ctrlKey && ke.shiftKey && ke.key === 'J') ||
          (ke.ctrlKey && ke.shiftKey && ke.key === 'C') ||
          (ke.ctrlKey && ke.key === 'u') ||
          (ke.metaKey && ke.altKey && ke.key === 'I')
        ) {
          e.preventDefault();
          e.stopPropagation();
          blockPageImmediately();
          return false;
        }
      }
    };

    // Add event listeners with highest priority
    document.addEventListener('contextmenu', blockAllEvents, { capture: true });
    document.addEventListener('keydown', blockAllEvents, { capture: true });
    document.addEventListener('selectstart', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('copy', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('cut', (e) => e.preventDefault(), { capture: true });
    document.addEventListener('paste', (e) => e.preventDefault(), { capture: true });

    // Trap user on page
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (securityRef.current.detected) {
        window.location.replace('https://www.dzd-marketing.site/dzd-preview.png');
      } else {
        history.pushState(null, '', window.location.href);
      }
    });

    // Prevent page unload
    window.addEventListener('beforeunload', (e) => {
      if (securityRef.current.detected) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });

    // Final check - if detection missed, this will catch it
    setTimeout(() => {
      if (!securityRef.current.detected) {
        detectAndBlock();
      }
    }, 100);

    return () => {
      clearInterval(detectionInterval);
      document.removeEventListener('contextmenu', blockAllEvents, { capture: true });
      document.removeEventListener('keydown', blockAllEvents, { capture: true });
    };
  }, []);

  // If blocked, render nothing (page is already cleared)
  if (blocked) return null;

  return <>{children}</>;
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
              <Route path="/wa-boost" element={<WaBoost user={user} fetchBalance={() => {}} />} />
              <Route path="/pricing" element={<PricingPage onSignupClick={openSignup} />} />
              <Route path="*" element={<Navigate to="/" />} />
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
