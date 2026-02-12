import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, LayoutGrid, User, Settings, LogOut, Menu, X, Moon, Sun, CreditCard, Shield, Home, HeadphonesIcon, Package, History, DollarSign, HelpCircle, ChevronRight } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-blue-600/10 hover:text-blue-600 transition-all border border-slate-200 dark:border-white/10"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
      {/* Header Bar Section */}
      <div className="relative z-[110] bg-white/90 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Zap size={22} fill="white" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">DzD <span className="text-blue-600">Marketing</span></span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10 font-bold uppercase tracking-widest text-[10px]">
              <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Services</a>
              <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Support</a>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-1.5 pr-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                      {(user.fullName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <div className="text-left leading-tight hidden lg:block">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[100px]">{user.fullName || user.name || 'Account'}</p>
                      <p className="text-[9px] font-black text-blue-500 uppercase">Verified User</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop Profile Dropdown - Keep as is */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#050b1a] rounded-3xl p-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] animate-scale-in border border-slate-200 dark:border-white/10 overflow-hidden isolate">
                      {/* ... existing dropdown content ... */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-600/5 blur-3xl -z-10 rounded-full"></div>
                      
                      <div className="px-5 py-5 border-b border-slate-100 dark:border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Command Profile</p>
                        <p className="text-sm font-black truncate text-slate-900 dark:text-white">{user.email}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Online</span>
                          </div>
                          <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-0.5 rounded-md">Platinum Member</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <LayoutGrid size={18} strokeWidth={2.5} /> Dashboard
                        </Link>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <User size={18} strokeWidth={2.5} /> Profile Vault
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <CreditCard size={18} strokeWidth={2.5} /> Billing
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-500 rounded-xl transition-all uppercase tracking-widest">
                          <Settings size={18} strokeWidth={2.5} /> Systems
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5">
                        <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest">
                          <LogOut size={18} strokeWidth={2.5} /> Terminate Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={onLoginClick} className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors px-4">Login</button>
                  <button onClick={onSignupClick} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">Join</button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`relative z-[200] p-2.5 rounded-xl border transition-all ${
                  isOpen 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white'
                }`}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* REDESIGNED MOBILE SIDEBAR - RIGHT SIDE DRAWER */}
      {/* ============================================ */}
      {mounted && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[150] transition-all duration-500 md:hidden ${
              isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar Drawer - Slides from Right */}
          <div 
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white dark:bg-[#030712] z-[160] shadow-2xl md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Premium Gradient Accent Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600" />
            
            {/* Background Glow Effects */}
            <div className="absolute top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-20 -left-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full" />
            
            <div className="relative h-full flex flex-col overflow-y-auto overflow-x-hidden">
              {/* Header Section */}
              <div className="px-6 pt-12 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                      <Zap size={24} fill="white" />
                    </div>
                    <div>
                      <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter block">DzD</span>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Marketing</span>
                    </div>
                  </div>
                  <button 
                    onClick={closeMobileMenu}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* User Profile Card - Compact */}
                {user && (
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-4 border border-blue-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {(user.fullName?.[0] || user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.fullName || user.name || 'User'}</p>
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active</span>
                          <span className="text-[8px] font-black bg-blue-600/20 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Platinum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation Links - Clean & Compact */}
              <div className="flex-1 px-4 py-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-2">Navigation</p>
                
                <div className="space-y-1.5">
                  <NavItem 
                    icon={<Home size={18} />} 
                    label="Home" 
                    onClick={() => handleNavigation('/')} 
                  />
                  <NavItem 
                    icon={<Package size={18} />} 
                    label="Services" 
                    onClick={() => {}} 
                    badge="12"
                  />
                  <NavItem 
                    icon={<History size={18} />} 
                    label="Orders" 
                    onClick={() => handleNavigation('/orders')} 
                  />
                  <NavItem 
                    icon={<LayoutGrid size={18} />} 
                    label="Dashboard" 
                    onClick={() => handleNavigation('/dashboard')} 
                  />
                  <NavItem 
                    icon={<DollarSign size={18} />} 
                    label="Pricing" 
                    onClick={() => {}} 
                  />
                  <NavItem 
                    icon={<HeadphonesIcon size={18} />} 
                    label="Support" 
                    onClick={() => {}} 
                  />
                  <NavItem 
                    icon={<HelpCircle size={18} />} 
                    label="FAQ" 
                    onClick={() => {}} 
                  />
                </div>
                
                {!user && (
                  <div className="mt-8 space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 px-2">Account</p>
                    <button 
                      onClick={() => { onLoginClick(); closeMobileMenu(); }}
                      className="w-full flex items-center justify-between px-4 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group"
                    >
                      <span className="flex items-center gap-4">
                        <User size={18} />
                        Login
                      </span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => { onSignupClick(); closeMobileMenu(); }}
                      className="w-full flex items-center justify-between px-4 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all group"
                    >
                      <span className="flex items-center gap-4">
                        <Shield size={18} />
                        Create Account
                      </span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Footer Actions */}
              <div className="px-4 py-6 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Theme</span>
                  <div className="scale-90">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                  </div>
                </div>
                
                {user && (
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group"
                  >
                    <LogOut size={18} />
                    Sign Out
                    <span className="flex-1 text-right">
                      <ChevronRight size={16} className="inline group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">DzD Marketing v2.0</p>
                  <p className="text-[7px] font-bold text-slate-500 mt-2">© 2024 All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// Helper component for nav items
const NavItem = ({ icon, label, onClick, badge }: { icon: React.ReactNode, label: string, onClick: () => void, badge?: string }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-500 font-black text-xs uppercase tracking-widest transition-all group"
  >
    <span className="flex items-center gap-4">
      <span className="text-slate-500 group-hover:text-blue-600 transition-colors">
        {icon}
      </span>
      {label}
    </span>
    <span className="flex items-center gap-2">
      {badge && (
        <span className="text-[8px] font-black bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
    </span>
  </button>
);
