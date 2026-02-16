import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Users,
  HeadphonesIcon,
  Sparkles,
  Zap,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from './Footer';

// RevealSection component (same as before)
const RevealSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
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

export default function ContactPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Invalid email address';
    if (!formData.whatsapp.trim()) return 'WhatsApp number is required';
    if (!formData.message.trim()) return 'Message is required';
    return null;
  };

  // Handle form submission with EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      // ===== IMPORTANT: Replace with your EmailJS credentials =====
      // 1. Sign up at https://www.emailjs.com/
      // 2. Create an email service and template
      // 3. Get your Public Key, Service ID, and Template ID
      const serviceID = 'service_r60qvar';      // e.g., 'service_xxx'
      const templateID = 'template_pduo3p8';    // e.g., 'template_xxx'
      const publicKey = 'xVgoWai2YpbIRvN8y';      // e.g., 'xxxxxxxxxxx'

      // Prepare template parameters (match your EmailJS template variables)
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        whatsapp: formData.whatsapp,
        message: formData.message,
        to_email: 'sitewasd2026@gmail.com' // where you want to receive emails
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      setStatus('success');
      setFormData({ name: '', email: '', whatsapp: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later or email us directly.');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-blue-600/30">

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-28 sm:pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="mesh-bg opacity-40">
          <div className="blob -top-20 -left-20 animate-pulse-slow bg-blue-600/20"></div>
          <div className="blob top-1/2 -right-20 animate-float bg-indigo-600/10" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-40 left-1/4 animate-pulse-slow bg-cyan-600/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealSection>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-500/20 border border-blue-600/30 px-4 py-2 rounded-full mb-6">
                <HeadphonesIcon size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">GET IN TOUCH</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tighter">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Us</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
                Have questions? Need help? Our team is here 24/7. Reach out via the form below or through any of our channels.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ========== CONTACT CARDS & FORM ========== */}
      <section className="py-8 lg:py-12 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {/* Quick Contact Cards */}
            <RevealSection>
              <div className="bg-slate-50 dark:bg-[#0a0f1c] p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all text-center group">
                <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">24/7 support</p>
                <a href="mailto:support@dzdmarketing.com" className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
                  support@dzdmarketing.com
                </a>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="bg-slate-50 dark:bg-[#0a0f1c] p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all text-center group">
                <div className="w-14 h-14 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">WhatsApp</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Instant replies</p>
                <a href="https://wa.me/18001234567" className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline">
                  +1 (800) 123-4567
                </a>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="bg-slate-50 dark:bg-[#0a0f1c] p-6 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all text-center group">
                <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">Average 2 min response</p>
                <button className="text-green-600 dark:text-green-400 text-sm font-bold hover:underline">
                  Start chat <ChevronRight size={14} className="inline" />
                </button>
              </div>
            </RevealSection>
          </div>

          {/* Main Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <RevealSection>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                  Send us a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Message</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-6">
                  Fill out the form and we'll get back to you within a few hours. All fields are required.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full h-12 px-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      WhatsApp Number (with country code) *
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full h-12 px-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Status messages */}
                  {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-medium">Message sent! We'll reply shortly.</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                    By submitting, you agree to our privacy policy and consent to being contacted.
                  </p>
                </form>
              </div>
            </RevealSection>

            {/* Right side - Additional info / map / social */}
            <RevealSection>
              <div className="bg-slate-50 dark:bg-[#0a0f1c] p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-slate-200 dark:border-white/5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <LifeBuoy size={20} className="text-blue-600" /> Other ways to connect
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Headquarters</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">123 Business Ave, Suite 100<br />New York, NY 10001, USA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Support Hours</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">24/7 - We never sleep</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-slate-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Social Media</p>
                      <div className="flex items-center gap-3 mt-2">
                        <a href="#" className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                          <Twitter size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                          <Facebook size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                          <Instagram size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                          <Linkedin size={14} />
                        </a>
                        <a href="#" className="w-8 h-8 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                          <Youtube size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-blue-600">Pro tip:</strong> For fastest response, use live chat or WhatsApp. We reply within minutes.</span>
                  </p>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ========== MAP / LOCATION (Optional placeholder) ========== */}
      <section className="py-12 bg-slate-50 dark:bg-[#050b1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="bg-slate-200 dark:bg-[#0f172a] rounded-2xl lg:rounded-3xl h-64 lg:h-80 overflow-hidden border border-slate-300 dark:border-white/5 flex items-center justify-center text-slate-500">
              {/* In a real project, embed a Google Map here */}
              <MapPin size={32} className="opacity-50" />
              <span className="ml-2">Interactive map would be embedded here</span>
            </div>
          </RevealSection>
        </div>
      </section>

    </div>
  );
}
