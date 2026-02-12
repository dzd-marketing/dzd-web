import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Loader2, 
  RefreshCw, 
  PlusCircle, 
  Globe, 
  Activity, 
  Zap, 
  ArrowRight,
  ChevronUp,
  Home,
  Grid,
  ShoppingBag,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  Flame
} from 'lucide-react';
import { fetchSmmApi } from './DashboardPage';

// Helper to extract keywords from service names for badges
const getStatusBadges = (name: string) => {
  const lower = name.toLowerCase();
  const badges = [];
  if (lower.includes('real') || lower.includes('hq')) badges.push({ text: 'HQ', color: 'bg-emerald-500 text-white', icon: CheckCircle });
  if (lower.includes('instant') || lower.includes('fast')) badges.push({ text: 'FAST', color: 'bg-amber-500 text-white', icon: Zap });
  if (lower.includes('no refill') || lower.includes('drop')) badges.push({ text: 'STABLE', color: 'bg-blue-500 text-white', icon: Clock });
  if (lower.includes('new') || lower.includes('update')) badges.push({ text: 'NEW', color: 'bg-pink-500 text-white', icon: Flame });
  return badges.slice(0, 2);
};

export default function ServicesPageView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const PAGE_SIZE = 20;

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSmmApi({ action: 'services' });
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setError('Communication error: Node structure mismatch.');
      }
    } catch (err) {
      setError('Protocol timeout: Server node unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(services.map(s => String(s.category))))];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.service.toString().includes(searchTerm);
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, activeCategory]);

  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount);
  }, [filteredServices, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#020617] dark:to-[#0f172a] pb-24">
      {/* Simple Header - No Frosted Glass */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Services
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Activity size={12} className="text-blue-500" />
              {filteredServices.length} active services
            </p>
          </div>
          <button 
            onClick={loadServices} 
            disabled={loading}
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 active:bg-slate-50 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search - Clean & Simple */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(20); }}
            className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categories - Horizontal Scroll */}
        <div className="mt-5 -mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-1">
            {categories.slice(0, 12).map(cat => (
              <button 
                key={cat} 
                onClick={() => { setActiveCategory(cat); setVisibleCount(20); }}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid - Card Based */}
      <div className="px-4 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
            <p className="text-xs font-medium text-slate-400">Loading services...</p>
          </div>
        ) : visibleServices.length > 0 ? (
          <div className="space-y-3">
            {visibleServices.map((service: any) => {
              const badges = getStatusBadges(service.name);
              
              return (
                <div 
                  key={service.service} 
                  className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 active:bg-slate-50 dark:active:bg-slate-800 transition-all"
                >
                  {/* Header Row with ID and Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        #{service.service}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {badges.map((b, idx) => {
                        const Icon = b.icon;
                        return (
                          <span 
                            key={idx} 
                            className={`${b.color} text-[8px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5`}
                          >
                            <Icon size={10} />
                            {b.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Name - Prominent */}
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight mb-3">
                    {service.name}
                  </h3>

                  {/* Price & Action Row */}
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                        Price / 1K
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${service.rate}
                        <span className="text-xs font-medium text-slate-400 ml-0.5">USD</span>
                      </p>
                    </div>
                    <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all">
                      <PlusCircle size={16} />
                      Order
                    </button>
                  </div>

                  {/* Payload Range - Secondary Info */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-400">Min-Max</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                        {service.min.toLocaleString()} - {service.max.toLocaleString()}
                      </span>
                    </div>
                    {service.max >= 1000000 && (
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
                        🚀 Bulk
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">No services found</p>
            <p className="text-xs text-slate-500 text-center">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Load More - Clean Button */}
        {!loading && filteredServices.length > visibleCount && (
          <div className="flex justify-center mt-8 mb-6">
            <button 
              onClick={handleLoadMore}
              className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 active:bg-slate-50 transition-all"
            >
              Load more ({filteredServices.length - visibleCount} remaining)
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-6 text-center mt-4">
            <Zap size={24} className="text-red-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button 
              onClick={loadServices} 
              className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-medium shadow-lg shadow-red-600/30"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Compact & Clean */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center justify-center p-2 text-blue-600">
            <Grid size={20} />
            <span className="text-[10px] font-medium mt-0.5">Services</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-medium mt-0.5">Orders</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400">
            <Home size={20} />
            <span className="text-[10px] font-medium mt-0.5">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400">
            <TrendingUp size={20} />
            <span className="text-[10px] font-medium mt-0.5">Analytics</span>
          </button>
          <button className="flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400">
            <User size={20} />
            <span className="text-[10px] font-medium mt-0.5">Profile</span>
          </button>
        </div>
      </div>

      {/* Scroll to Top - Only shows when scrolled */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-transform z-40"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
