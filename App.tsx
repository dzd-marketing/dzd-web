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

// Anti-DevTools Component - Maximum Security
const AntiDevTools = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const devtoolsDetectedRef = React.useRef(false);
  const redirectInProgressRef = React.useRef(false);

  useEffect(() => {
    // Detect if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();

    // Function to block the page completely
    const blockPage = () => {
      if (blocked || isMobile) return;
      setBlocked(true);
      
      // Clear the entire document
      document.documentElement.innerHTML = '';
      
      // Create a full-screen blocker
      const blocker = document.createElement('div');
      blocker.style.position = 'fixed';
      blocker.style.top = '0';
      blocker.style.left = '0';
      blocker.style.width = '100%';
      blocker.style.height = '100%';
      blocker.style.backgroundColor = 'black';
      blocker.style.zIndex = '9999999';
      blocker.style.display = 'flex';
      blocker.style.alignItems = 'center';
      blocker.style.justifyContent = 'center';
      
      // Add image
      const img = document.createElement('img');
      img.src = 'https://www.dzd-marketing.site/dzd-preview.png';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      
      blocker.appendChild(img);
      document.body.appendChild(blocker);
      
      // Disable all interactions
      document.body.style.pointerEvents = 'none';
      document.body.style.overflow = 'hidden';
      
      // Prevent any navigation
      window.addEventListener('popstate', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        history.pushState(null, '', window.location.href);
      });
      
      // Disable back button completely
      history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', function(event) {
        history.pushState(null, '', window.location.href);
      });
    };

    // Function to force redirect with maximum obstruction
    const forceRedirect = () => {
      if (devtoolsDetectedRef.current || redirectInProgressRef.current || isMobile) return;
      
      redirectInProgressRef.current = true;
      devtoolsDetectedRef.current = true;
      
      try {
        // Method 1: Try to block page first
        blockPage();
        
        // Method 2: Multiple redirect attempts
        const redirectUrl = 'https://www.dzd-marketing.site/dzd-preview.png';
        
        // Try different redirect methods
        setTimeout(() => {
          window.location.replace(redirectUrl);
        }, 10);
        
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 20);
        
        setTimeout(() => {
          window.open(redirectUrl, '_self');
        }, 30);
        
        setTimeout(() => {
          document.location = redirectUrl;
        }, 40);
        
        // Method 3: If redirect fails, keep blocking
        setTimeout(() => {
          if (!blocked) {
            blockPage();
          }
        }, 100);
        
      } catch (error) {
        // If redirect fails, block page
        blockPage();
      }
    };

    // Override console methods to prevent debugging
    const overrideConsole = () => {
      const originalConsole = { ...console };
      const consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
      
      consoleMethods.forEach(method => {
        try {
          (console as any)[method] = () => {};
        } catch (e) {}
      });
      
      // Restore if devtools closes (unlikely but just in case)
      return () => {
        consoleMethods.forEach(method => {
          try {
            (console as any)[method] = originalConsole[method as keyof Console];
          } catch (e) {}
        });
      };
    };

    // Enhanced detection methods that don't pause
    const detectDevTools = () => {
      if (devtoolsDetectedRef.current || isMobile) return true;

      // Method 1: Check dimensions (fast, no pause)
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        forceRedirect();
        return true;
      }

      // Method 2: Check for debugger without pausing
      const start = performance.now();
      let debuggerDetected = false;
      
      // Use try-catch to avoid pause
      try {
        // This won't pause if devtools is closed
        const func = new Function('debugger;');
        func();
        const end = performance.now();
        
        if (end - start > 50) {
          debuggerDetected = true;
        }
      } catch (e) {
        debuggerDetected = true;
      }
      
      if (debuggerDetected) {
        forceRedirect();
        return true;
      }

      // Method 3: Check for devtools via toString
      try {
        const element = new Error();
        if (element.stack && element.stack.includes('debugger')) {
          forceRedirect();
          return true;
        }
      } catch (e) {}

      // Method 4: Check for devtools via console profile
      try {
        if ((console as any).profile) {
          forceRedirect();
          return true;
        }
      } catch (e) {}

      return false;
    };

    // Run immediate detection without pausing
    const runImmediateDetection = () => {
      // Override console first
      overrideConsole();
      
      // Run detection multiple times quickly
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          detectDevTools();
        }, i * 50);
      }
    };

    // Run immediately
    runImmediateDetection();

    // Silent right-click prevention
    const handleRightClick = (e: MouseEvent) => {
      if (!isMobile) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMobile || devtoolsDetectedRef.current) return;

      const isDevToolsShortcut = 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && e.key === 'U' || e.key === 'u') ||
        (e.key === 'F12') ||
        (e.metaKey && e.altKey && e.key === 'I' || e.key === 'i') ||
        (e.key === 'S' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.ctrlKey && e.shiftKey && e.key === 'C' || e.key === 'c'); // Element inspector

      if (isDevToolsShortcut) {
        e.preventDefault();
        e.stopPropagation();
        forceRedirect();
      }

      // Also block view source
      if (e.ctrlKey && e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        forceRedirect();
      }
    };

    // Prevent text selection on desktop
    const handleSelectStart = (e: Event) => {
      if (!isMobile) {
        e.preventDefault();
      }
    };

    // Add all event listeners
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    
    // Override devtools opening methods
    window.addEventListener('resize', () => {
      if (!isMobile) {
        detectDevTools();
      }
    });

    // Periodic checks
    const checkInterval = setInterval(() => {
      if (!devtoolsDetectedRef.current && !isMobile) {
        detectDevTools();
      }
    }, 200); // Check more frequently

    // Prevent navigation away from block page
    window.addEventListener('beforeunload', (e) => {
      if (devtoolsDetectedRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });

    // Prevent back/forward navigation
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', (e) => {
      if (devtoolsDetectedRef.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
        history.pushState(null, '', window.location.href);
      }
    });

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('resize', detectDevTools);
      clearInterval(checkInterval);
    };
  }, [isMobile, blocked]);

  // If blocked, render nothing (already handled by DOM manipulation)
  if (blocked) {
    return null;
  }

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
