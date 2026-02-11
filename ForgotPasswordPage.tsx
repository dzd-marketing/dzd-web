
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-dark flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 pt-24 sm:pt-32 relative overflow-y-auto no-scrollbar transition-colors duration-300">
      {/* Background Effects - Themed */}
      <div className="mesh-bg opacity-20 dark:opacity-30">
        <div className="blob -top-20 -left-20 bg-blue-600"></div>
        <div className="blob bottom-0 right-0 bg-blue-400 dark:bg-indigo-900"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 animate-scale-in my-auto">
        {/* Branding Header - Optional since Navbar is present, but good for focus */}
        <div className="mb-6 text-center lg:hidden">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Zap size={18} fill="white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">DzD <span className="text-blue-600">Marketing</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#050b1a] rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-3xl p-6 sm:p-10 md:p-12 overflow-hidden relative">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 dark:bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Login Page
          </button>

          {!sent ? (
            <>
              <div className="mb-8 sm:mb-10 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Security Recovery</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed">
                  Enter your verified email to receive a secure recovery key and regain access to your dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Verified Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input 
                      required 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-[#0a1121] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                      placeholder="mail@yourdomain.com" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 sm:py-5 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Send Recovery Link <ArrowRight size={20} /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="w-20 h-20 bg-blue-600/10 dark:bg-blue-600/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-500 mx-auto mb-6 border border-blue-500/10 dark:border-blue-500/20 animate-pulse">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Check Your Comms</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-sm mx-auto text-sm">
                If an account exists for <span className="text-blue-600 font-bold">{email}</span>, you will receive recovery instructions shortly.
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-slate-100 dark:bg-[#0a1121] text-slate-900 dark:text-white font-black px-10 py-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-[#0f172a] transition-all text-sm"
              >
                Go to Homepage
              </button>
            </div>
          )}

          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Need immediate assistance? <a href="#" className="text-blue-600 hover:underline">Contact Protocol Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
