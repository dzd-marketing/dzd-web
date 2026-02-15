import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Sparkles,
  Star,
  HeadphonesIcon,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Users,
  Globe,
  BarChart3,
  CreditCard,
  HelpCircle,
  X,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Youtube as YoutubeIcon,
  ChevronUp
} from 'lucide-react';
import Footer from './Footer';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Reusable reveal section (same as in LandingPage)
const RevealSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
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

// Pricing data
const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 29,
    yearlyPrice: 290, // 2 months free
    features: [
      'Up to 5,000 orders/month',
      'Basic analytics',
      'Email support',
      'Access to all services',
      'API access (limited)',
    ],
    notIncluded: [
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'blue',
  },
  {
    name: 'Pro',
    description: 'For growing businesses and agencies',
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      'Up to 25,000 orders/month',
      'Advanced analytics',
      'Priority email & chat support',
      'Full API access',
      'White-label option',
      'Team management',
    ],
    notIncluded: [],
    cta: 'Get Started',
    popular: true,
    color: 'purple',
  },
  {
    name: 'Business',
    description: 'For large teams and high-volume needs',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      'Unlimited orders',
      'Real-time analytics dashboard',
      '24/7 phone & chat support',
      'Custom SLA',
      'Dedicated account manager',
      'SSO & advanced security',
      'API rate limit increase',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'green',
  },
];

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we prorate the difference.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Absolutely! All plans come with a 14-day free trial, no credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, cryptocurrency (USDT, BTC, ETH), and bank transfers for annual plans.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No, there are no hidden fees or setup costs. You only pay the subscription price.',
  },
  {
    question: 'Do you offer discounts for non-profits?',
    answer: 'Yes, we offer special pricing for verified non-profit organizations. Please contact our sales team.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You will still have access until the end of your billing period.',
  },
];

export default function PricingPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCtaClick = (planName: string) => {
    if (user) {
      // If logged in, maybe go to checkout or dashboard
      navigate('/dashboard');
    } else {
      onSignupClick?.();
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-blue-600/30">
      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-24 sm:pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="mesh-bg opacity-40">
          <div className="blob -top-20 -left-20 animate-pulse-slow bg-blue-600/20"></div>
          <div className="blob top-1/2 -right-20 animate-float bg-indigo-600/10" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-40 left-1/4 animate-pulse-slow bg-cyan-600/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-500/20 border border-blue-600/30 px-4 py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-blue-600 dark:text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">SIMPLE & TRANSPARENT PRICING</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 sm:mb-6 tracking-tighter">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Plan</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              No hidden fees. Scale your social media presence with the most reliable SMM panel. 14-day free trial on all plans.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
              <span className={`text-sm font-black ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-slate-400'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-white/10 p-1 transition-colors"
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-7 bg-blue-600' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-black ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-slate-400'}`}>
                Yearly <span className="text-[10px] text-green-500 font-bold ml-1">Save 20%</span>
              </span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ========== PRICING CARDS ========== */}
      <section className="pb-16 lg:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, index) => (
              <RevealSection key={index}>
                <div
                  className={`
                    relative bg-white dark:bg-[#0a0f1c] rounded-2xl lg:rounded-3xl border p-6 lg:p-8
                    ${plan.popular
                      ? 'border-2 border-blue-500/50 shadow-xl shadow-blue-600/20 dark:shadow-blue-600/10 scale-105 lg:scale-110 z-10'
                      : 'border border-slate-200 dark:border-white/10 hover:border-blue-500/30'
                    }
                    transition-all duration-300 hover:-translate-y-2 group
                  `}
                >
                  {plan.popular && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-50">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[8px] lg:text-[9px] font-black px-3 lg:px-4 py-1.5 lg:py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center gap-1.5">
                        <Sparkles size={10} className="lg:w-3 lg:h-3" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${plan.color}-600/10 flex items-center justify-center text-${plan.color}-600 group-hover:scale-110 transition-transform`}>
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-sm text-slate-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-xs text-green-500 font-bold mt-1">Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-600">
                        <X size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCtaClick(plan.name)}
                    className={`
                      w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                      ${plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-1'
                        : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white hover:border-transparent'
                      }
                    `}
                  >
                    {plan.cta}
                  </button>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURE COMPARISON ========== */}
      <section className="py-16 lg:py-24 bg-white dark:bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4">
              <BarChart3 size={12} /> COMPARE PLANS
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Succeed</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
              All plans include core features. Upgrade to unlock advanced capabilities.
            </p>
          </RevealSection>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="py-4 text-left font-black text-slate-900 dark:text-white">Feature</th>
                  {pricingPlans.map((plan, i) => (
                    <th key={i} className="py-4 text-center font-black text-slate-900 dark:text-white">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">Orders per month</td>
                  <td className="py-4 text-center font-bold text-slate-900 dark:text-white">5,000</td>
                  <td className="py-4 text-center font-bold text-slate-900 dark:text-white">25,000</td>
                  <td className="py-4 text-center font-bold text-slate-900 dark:text-white">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">Analytics</td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">API Access</td>
                  <td className="py-4 text-center"><span className="text-slate-400">Limited</span></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">Priority Support</td>
                  <td className="py-4 text-center"><X size={16} className="inline text-slate-400" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">White-label</td>
                  <td className="py-4 text-center"><X size={16} className="inline text-slate-400" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <td className="py-4 text-slate-600 dark:text-slate-400">Dedicated Account Manager</td>
                  <td className="py-4 text-center"><X size={16} className="inline text-slate-400" /></td>
                  <td className="py-4 text-center"><X size={16} className="inline text-slate-400" /></td>
                  <td className="py-4 text-center"><Check size={16} className="inline text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-[#050b1a] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 text-blue-500 font-black uppercase tracking-[0.4em] text-[8px] lg:text-[9px] mb-3 lg:mb-4">
              <HelpCircle size={12} /> FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 lg:mb-4 tracking-tighter">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
              Got questions? We've got answers.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <RevealSection key={index}>
                <div className="bg-white dark:bg-[#0a0f1c] p-5 lg:p-6 rounded-xl border border-slate-200 dark:border-white/5 hover:shadow-lg transition-all">
                  <h3 className="font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <HelpCircle size={16} className="text-blue-600 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-16 lg:py-24 px-4 relative overflow-hidden">
        <RevealSection>
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl lg:rounded-[3rem] p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
            
            <div className="relative z-10 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tighter leading-tight">
                Ready to Start Growing?
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto font-medium px-4">
                Join thousands of businesses that trust DzD Marketing. Start your 14-day free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
                <button
                  onClick={() => (user ? navigate('/dashboard') : onSignupClick?.())}
                  className="bg-white text-blue-600 px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm hover:scale-105 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-3"
                >
                  Get Started <ArrowRight size={14} className="lg:w-4 lg:h-4" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-white/10 backdrop-blur-md text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 lg:gap-3"
                >
                  <HeadphonesIcon size={14} className="lg:w-4 lg:h-4" /> Contact Sales
                </button>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
}