
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Check, Zap, ArrowRight, ShieldCheck, Smartphone, X } from 'lucide-react';
import { auth } from './firebase';

export default function SignupPage({ onSignup, onClose, onSwitchToLogin }: { onSignup: (u: any) => void, onClose: () => void, onSwitchToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({ label: '', color: 'bg-slate-200', score: 0 });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!password) {
      setStrength({ label: '', color: 'bg-slate-100', score: 0 });
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) setStrength({ label: 'Weak', color: 'bg-red-500', score: 1 });
    else if (score === 2) setStrength({ label: 'Medium', color: 'bg-yellow-500', score: 2 });
    else if (score === 3) setStrength({ label: 'Strong', color: 'bg-blue-500', score: 3 });
    else setStrength({ label: 'Very Strong', color: 'bg-green-500', score: 4 });
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    setLoading(true);
    // Note: Future implementation will use 'auth' from './firebase'
    setTimeout(() => {
      onSignup({ email, name: username, onboarded: false });
      setLoading(false);
    }, 1500);
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    // Note: Future implementation will use 'auth' from './firebase' with GoogleAuthProvider
    setTimeout(() => {
      onSignup({ email: 'googleuser@gmail.com', name: 'Google User', onboarded: false });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto no-scrollbar bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer -z-10" onClick={onClose} />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-3xl animate-scale-in border border-slate-100 relative z-10 my-auto h-auto min-h-fit isolate">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-200 transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Left Side: Brand Story (Hidden on smaller screens to save space) */}
        <div className="hidden lg:flex lg:w-5/12 bg-slate-50 border-r border-slate-100 flex-col p-16 relative">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg"><Zap size={24} fill="white" /></div>
              <span className="text-xl font-bold text-slate-900 uppercase tracking-tight">DzD <span className="text-blue-600">Marketing</span></span>
            </div>
          </div>
          <div className="max-w-sm flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">Elevate your social presence <span className="text-blue-600">instantly.</span></h1>
            <div className="space-y-4">
              {[
                { title: "Instant Delivery", icon: <Zap className="text-blue-600" size={16} />, bg: "bg-blue-100" },
                { title: "24/7 Support", icon: <Smartphone className="text-blue-600" size={16} />, bg: "bg-indigo-100" },
                { title: "Secure Payments", icon: <ShieldCheck className="text-blue-600" size={16} />, bg: "bg-blue-100" }
              ].map((f, i) => (
                <div key={i} className="flex gap-4 group items-center">
                  <div className={`w-9 h-9 shrink-0 rounded-xl ${f.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>{f.icon}</div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">{f.title}</h4>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-fit">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" /></div>
                  ))}
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trusted by 10k+</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 sm:p-10 md:p-12 lg:p-16 bg-white overflow-visible">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Identity</h2>
              <p className="text-slate-400 font-medium text-sm">Join the elite marketing ecosystem.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                    <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm" placeholder="Name" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                    <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm" placeholder="handle" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm" placeholder="mail@example.com" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-12 text-slate-900 focus:border-blue-600 outline-none transition-all font-medium text-sm" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <div className="px-1 pt-2">
                  <div className="flex gap-1 mb-1.5">{[1, 2, 3, 4].map(l => (<div key={l} className={`h-1 flex-1 rounded-full transition-all duration-500 ${l <= strength.score ? strength.color : 'bg-slate-100'}`}></div>))}</div>
                  <div className="flex justify-between items-center"><p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">8+ characters required</p><p className={`text-[9px] font-black uppercase tracking-widest ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Identity</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                  <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`w-full bg-slate-50 border rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none transition-all font-medium text-sm ${confirmPassword && password !== confirmPassword ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'}`} placeholder="Repeat password" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 py-1 cursor-pointer group select-none" onClick={() => setAgreed(!agreed)}>
                <div className={`w-5 h-5 shrink-0 rounded-lg border flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/20' : 'border-slate-200 bg-slate-50 group-hover:border-blue-400'}`}>
                  {agreed && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
                <span className="text-xs text-slate-500 font-medium tracking-tight">Accept <button type="button" className="text-blue-600 font-black hover:underline">Terms of Service</button></span>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span className="flex items-center gap-2">Create Account <ArrowRight size={18} /></span>}
              </button>
            </form>
            
            <div className="mt-5 relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Or</span>
            </div>
            
            <button onClick={handleGoogleSignup} className="mt-5 w-full bg-slate-50 border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-900 hover:bg-slate-100 transition-all active:scale-[0.99] text-sm">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-4 h-4" alt="G" />
              Sign up with Google
            </button>
            
            <p className="mt-6 text-center text-slate-500 font-medium text-xs pb-4">
              Member already? <button onClick={onSwitchToLogin} className="text-blue-600 font-black ml-1 hover:underline">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
