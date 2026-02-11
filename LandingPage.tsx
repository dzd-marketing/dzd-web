
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Smartphone, LayoutGrid, Award, ShieldCheck, Globe, Rocket } from 'lucide-react';
import Footer from './Footer';

const RevealSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isActive ? 'active' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default function LandingPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = {
    all: { 
      title: "Full Spectrum Social Dominance", 
      desc: "Our platform offers a comprehensive suite of tools to scale your presence across every major social ecosystem simultaneously.", 
      points: ["Cross-platform synchronization", "Real-time metrics", "Automated delivery"] 
    },
    tiktok: { 
      title: "Unleash Viral Potential", 
      desc: "Harness the power of the most explosive growth engine on the internet. We provide the fuel for your TikTok content to hit the FYP.", 
      points: ["High-retention views", "Organic follower scaling", "Engagement acceleration"] 
    },
    instagram: { 
      title: "Premium Aesthetic Growth", 
      desc: "Visual storytelling requires a high-quality audience. Our Instagram services focus on quality profiles that boost your credibility.", 
      points: ["Premium profile likes", "Global & niche targeting", "Reels visibility"] 
    },
    facebook: { 
      title: "Establish Market Authority", 
      desc: "Build a robust business foundation. We help your Facebook pages gain the social proof required to convert followers into customers.", 
      points: ["Verified-look page likes", "Group engagement boosts", "Ad-safe visibility"] 
    }
  };

  const current = platforms[selectedPlatform as keyof typeof platforms];

  return (
    <div className="bg-slate-50 dark:bg-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="mesh-bg">
          <div className="blob -top-20 -left-20 animate-pulse-slow"></div>
          <div className="blob top-1/2 -right-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-20 left-1/2 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="text-left">
              <RevealSection>
                <div className="inline-flex items-center gap-2 bg-blue-600/5 dark:bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">The Elite SMM Marketplace</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tighter">
                  Command Your <br />
                  <span className="text-gradient">Digital Empire</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg mb-10 font-medium leading-relaxed">
                  Experience unparalleled growth with professional SMM services designed for the next generation of digital leaders.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={onSignupClick}
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 transition-all hover:-translate-y-1"
                  >
                    Start Growing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Explore Services
                  </button>
                </div>
              </RevealSection>
            </div>

            {/* Right Column: Image Wrapper */}
            <div className="relative">
              <RevealSection className="lg:pl-10">
                <div className="relative group">
                  <div className="glass p-2 rounded-[2.5rem] shadow-3xl animate-float">
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-[4/3] relative group shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1622737133809-d95047b9e673?auto=format&fit=crop&q=80&w=1200" 
                        alt="Platform Preview" 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-blue-600/20 backdrop-blur-xl p-6 rounded-full border border-white/20">
                          <Zap size={36} className="text-white animate-pulse" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Global Reach</p>
                          <h4 className="text-white text-lg font-black">99.9% Uptime</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 hidden sm:block bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-blue-600/20 animate-float" style={{ animationDelay: '1s' }}>
                    <Award size={24} className="text-blue-600 mb-1" />
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">#1 Global Panel</p>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <RevealSection className="py-16 border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-darkSecondary/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Successful Orders", value: "2.4M+", icon: <Rocket /> },
              { label: "Active Clients", value: "85K+", icon: <Globe /> },
              { label: "Growth Retention", value: "98.2%", icon: <Award /> },
              { label: "Support Speed", value: "< 2m", icon: <Zap /> },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-translate-y-1">
                  {React.cloneElement(s.icon, { size: 24 })}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">{s.value}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Platform Selector Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <RevealSection>
                <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Omnichannel Growth</p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{current.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">{current.desc}</p>
                <div className="space-y-4">
                  {current.points.map((text, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm group hover:border-blue-600/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-slate-800 dark:text-slate-200 font-bold text-base">{text}</span>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>

            <div className="lg:col-span-7">
              <RevealSection className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {[
                  { id: 'tiktok', icon: <Smartphone size={32} />, name: 'TikTok' },
                  { id: 'instagram', icon: <Smartphone size={32} />, name: 'Instagram' },
                  { id: 'facebook', icon: <Smartphone size={32} />, name: 'Facebook' },
                  { id: 'all', icon: <LayoutGrid size={32} />, name: 'All Services' }
                ].map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatform(p.id)} 
                    className={`p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all border-2 relative overflow-hidden group ${selectedPlatform === p.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/40 -translate-y-1' 
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-blue-600/30'}`}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${selectedPlatform === p.id ? 'bg-white/20' : 'bg-blue-600/10 text-blue-600'}`}>
                      {p.icon}
                    </div>
                    <span className="font-black text-base capitalize tracking-tight">{p.name}</span>
                  </button>
                ))}
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="py-24 bg-slate-900 dark:bg-darkSecondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mesh-bg">
           <div className="blob bottom-0 left-0 bg-blue-600"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <RevealSection>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Why Professionals <br /><span className="text-blue-500">Choose DzD</span></h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">We provide the foundation for your brand's future success with high-retention services.</p>
            </RevealSection>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Elite Network", desc: "Access high-retention users from genuine global networks, ensuring your growth remains stable." },
              { title: "Lightning API", desc: "Integration ready. Our high-frequency API handles thousands of requests per minute." },
              { title: "24/7 VIP Support", desc: "Dedicated account managers available around the clock to ensure your campaigns run smoothly." }
            ].map((f, i) => (
              <RevealSection key={i} className="group glass p-8 rounded-[2.5rem] hover:bg-blue-600/10 transition-all border-white/5">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="text-xl font-black mb-4 tracking-tight">{f.title}</h4>
                <p className="text-slate-400 leading-relaxed text-base">{f.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <RevealSection>
          <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 animate-gradient-x opacity-50"></div>
            
            <div className="relative z-10 text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready to <br />Claim Your Spot?</h2>
              <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto font-medium">Join 85,000+ creators who have already leveled up with DzD Marketing.</p>
              <button 
                onClick={onSignupClick}
                className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 hover:shadow-2xl transition-all"
              >
                Create Account Free
              </button>
            </div>

            <div className="absolute top-10 left-10 w-24 h-24 border-4 border-white/10 rounded-full animate-float"></div>
          </div>
        </RevealSection>
      </section>

      <Footer />
    </div>
  );
}
