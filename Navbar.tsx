
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, LayoutGrid, User, Settings, LogOut, Menu, X, Moon, Sun } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all border border-slate-300 dark:border-white/10"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default function Navbar({ theme, toggleTheme, user, onLogout, onLoginClick, onSignupClick }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Zap size={24} fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white uppercase">DzD <span className="text-blue-600">Marketing</span></span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 font-semibold">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Home</Link>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Services</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 text-sm">Support</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name || 'User'}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass rounded-2xl p-2 shadow-2xl animate-scale-in border border-slate-200 dark:border-white/10">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 mb-2">
                      <p className="text-[10px] font-black uppercase text-slate-400">Account</p>
                      <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <LayoutGrid size={18} /> Dashboard
                    </Link>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <User size={18} /> Profile Details
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-semibold">
                      <Settings size={18} /> Settings
                    </button>
                    <hr className="my-2 border-slate-200 dark:border-white/5" />
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={onLoginClick} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm px-4">Login</button>
                <button onClick={onSignupClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg">Sign Up</button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Tray - Now Absolutely Positioned */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-dark border-b border-slate-200 dark:border-white/5 animate-slide-up shadow-2xl z-50 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="px-6 pt-2 pb-8 space-y-2">
            <Link to="/" onClick={closeMobileMenu} className="block py-4 text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">Home</Link>
            <a href="#" onClick={closeMobileMenu} className="block py-4 text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">Services</a>
            <a href="#" onClick={closeMobileMenu} className="block py-4 text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">Support</a>
            
            {user ? (
               <div className="pt-4 space-y-3">
                  <Link to="/dashboard" onClick={closeMobileMenu} className="flex items-center gap-3 py-4 text-blue-600 font-black">
                    <LayoutGrid size={20} /> Dashboard
                  </Link>
                  <button onClick={() => { onLogout(); closeMobileMenu(); }} className="flex items-center gap-3 py-4 text-red-500 font-black">
                    <LogOut size={20} /> Logout
                  </button>
               </div>
            ) : (
              <div className="pt-6 flex flex-col gap-4">
                 <button 
                  onClick={() => { onLoginClick(); closeMobileMenu(); }} 
                  className="w-full py-4 text-slate-900 dark:text-white font-black border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5"
                >
                  Login
                </button>
                 <button 
                  onClick={() => { onSignupClick(); closeMobileMenu(); }} 
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
