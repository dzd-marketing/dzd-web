import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, LayoutGrid, User, Settings, LogOut, Menu, X, Moon, Sun, CreditCard, Home, ShoppingCart, History, HelpCircle, BarChart3 } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default function Navbar({ theme, toggleTheme, user, onLogout, onLoginClick, onSignupClick }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMobileMenu = () => setIsOpen(false);

  const handleSignOut = () => {
    setProfileOpen(false);
    setIsOpen(false);
    onLogout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100]">
      {/* Header Bar */}
      <div className="relative z-[110] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="white" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">DzD <span className="text-blue-600">Marketing</span></span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 font-bold uppercase tracking-widest text-[10px]">
              <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Home</Link>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Services</a>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Support</a>
            </div>

            {/* Desktop Right Section - Keep existing */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Desktop profile dropdown - keep as is */}
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                      {(user.fullName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white hidden lg:block">{user.fullName || user.name || 'Account'}</span>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0a0f1c] rounded-xl shadow-lg border border-slate-200 dark:border-white/10 py-2">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                        <p className="text-[10px] font-bold text-blue-600 mt-1">Verified User</p>
                      </div>
                      <div className="py-1">
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">
                          <LayoutGrid size={16} /> Dashboard
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5">
                          <ShoppingCart size={16} /> Orders
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 w-full text-left">
                          <User size={16} /> Profile
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 w-full text-left">
                          <Settings size={16} /> Settings
                        </button>
                      </div>
                      <div className="border-t border-slate-100 dark:border-white/5 mt-1 pt-1">
                        <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 px-3">Login</button>
                  <button onClick={onSignupClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-md">Join</button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar - CLEAN & MINIMAL */}
      {mounted && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/40 z-[150] md:hidden transition-opacity duration-300 ${
              isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar Drawer */}
          <div 
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-[#0a0f1c] z-[160] md:hidden shadow-xl transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="h-full flex flex-col overflow-y-auto">
              
              {/* Header */}
              <div className="px-5 py-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Zap size={16} fill="white" />
                    </div>
                    <span className="text-base font-black text-slate-900 dark:text-white uppercase">DzD</span>
                  </div>
                  <button 
                    onClick={closeMobileMenu}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 px-3 py-4">
                {/* PUBLIC LINKS - Always visible */}
                <div className="mb-6">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">General</p>
                  <div className="space-y-0.5">
                    <NavItem 
                      icon={<Home size={16} />} 
                      label="Home" 
                      onClick={() => handleNavigation('/')} 
                    />
                    <NavItem 
                      icon={<ShoppingCart size={16} />} 
                      label="Services" 
                      onClick={() => {}} 
                    />
                    <NavItem 
                      icon={<HelpCircle size={16} />} 
                      label="Support" 
                      onClick={() => {}} 
                    />
                  </div>
                </div>
                
                {/* DASHBOARD LINKS - Only visible when logged in */}
                {user && (
                  <div className="mb-6">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Dashboard</p>
                    <div className="space-y-0.5">
                      <NavItem 
                        icon={<LayoutGrid size={16} />} 
                        label="Dashboard" 
                        onClick={() => handleNavigation('/dashboard')} 
                      />
                      <NavItem 
                        icon={<ShoppingCart size={16} />} 
                        label="My Orders" 
                        onClick={() => handleNavigation('/orders')} 
                      />
                      <NavItem 
                        icon={<History size={16} />} 
                        label="Order History" 
                        onClick={() => handleNavigation('/orders')} 
                      />
                      <NavItem 
                        icon={<BarChart3 size={16} />} 
                        label="Analytics" 
                        onClick={() => handleNavigation('/analytics')} 
                      />
                      <NavItem 
                        icon={<CreditCard size={16} />} 
                        label="Billing" 
                        onClick={() => {}} 
                      />
                      <NavItem 
                        icon={<Settings size={16} />} 
                        label="Settings" 
                        onClick={() => {}} 
                      />
                    </div>
                  </div>
                )}
                
                {/* ACCOUNT SECTION - Changes based on auth state */}
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Account</p>
                  
                  {user ? (
                    <>
                      {/* User Info Card */}
                      <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 mb-2 mx-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                            {(user.fullName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.fullName || user.name || 'User'}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <NavItem 
                        icon={<User size={16} />} 
                        label="Profile" 
                        onClick={() => {}} 
                      />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors mx-3"
                        style={{ width: 'calc(100% - 1.5rem)' }}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 px-3">
                      <button
                        onClick={() => { onLoginClick(); closeMobileMenu(); }}
                        className="w-full px-4 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => { onSignupClick(); closeMobileMenu(); }}
                        className="w-full px-4 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">v2.0.0</span>
                  <span className="text-[8px] font-medium text-slate-400">© 2024 DzD</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// Simple Nav Item Component
const NavItem = ({ icon, label, onClick, badge }: { icon: React.ReactNode, label: string, onClick: () => void, badge?: string }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
  >
    <span className="flex items-center gap-3">
      <span className="text-slate-500 dark:text-slate-400">{icon}</span>
      {label}
    </span>
    {badge && (
      <span className="text-[8px] font-bold bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);
