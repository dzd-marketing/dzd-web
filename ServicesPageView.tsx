
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Loader2, 
  RefreshCw, 
  PlusCircle, 
  Globe, 
  Activity, 
  Zap, 
  Filter, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { fetchSmmApi } from './DashboardPage';

// Helper to extract keywords from service names for badges
const getStatusBadges = (name: string) => {
  const lower = name.toLowerCase();
  const badges = [];
  if (lower.includes('real') || lower.includes('hq')) badges.push({ text: 'HQ', color: 'bg-emerald-500/10 text-emerald-500' });
  if (lower.includes('instant') || lower.includes('fast')) badges.push({ text: 'FAST', color: 'bg-amber-500/10 text-amber-500' });
  if (lower.includes('no refill') || lower.includes('drop')) badges.push({ text: 'STABLE', color: 'bg-blue-500/10 text-blue-500' });
  if (lower.includes('new') || lower.includes('update')) badges.push({ text: 'NEW', color: 'bg-pink-500/10 text-pink-500' });
  return badges.slice(0, 2);
};

export default function ServicesPageView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(30);
  const PAGE_SIZE = 50;

  const loadServices = async () => {
    setLoading(true);
    setError('');
    setVisibleCount(30); // Reset pagination on reload
    try {
      const data = await fetchSmmApi({ action: 'services' });
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setError('Communication error: Node returned invalid data structure.');
      }
    } catch (err) {
      console.error(err);
      setError('Protocol timeout: Proxy server is overloaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(services.map(s => String(s.category))))];
    return cats;
  }, [services]);

  const filteredServices = useMemo(() => {
    const filtered = services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.service.toString().includes(searchTerm);
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    return filtered;
  }, [services, searchTerm, activeCategory]);

  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount);
  }, [filteredServices, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  return (
    <div className="animate-fade-in space-y-6 md:space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">Protocol Directory</h1>
          <div className="flex items-center gap-2">
             <Activity size={12} className="text-blue-500 animate-pulse" />
             <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">{services.length} Nodes Active</p>
          </div>
        </div>
        <button 
          onClick={loadServices} 
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest">Resync Matrix</span>
        </button>
      </div>

      {/* Global Command Center (Filters & Search) */}
      <div className="sticky top-20 z-30 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search Protocol ID or Service Name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(30); }}
              className="w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] py-4 md:py-5 pl-14 pr-6 font-bold text-sm focus:border-blue-600 outline-none transition-all shadow-lg text-slate-900 dark:text-white"
            />
          </div>
          
          {/* Mobile Category Toggle - Scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:max-w-md lg:max-w-none">
             {categories.slice(0, 12).map(cat => (
               <button 
                key={cat} 
                onClick={() => { setActiveCategory(cat); setVisibleCount(30); }}
                className={`px-5 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30' : 'bg-white dark:bg-[#0f172a]/60 text-slate-500 border-slate-200 dark:border-white/5 hover:border-blue-500'}`}
               >
                 {cat}
               </button>
             ))}
             {categories.length > 12 && (
                <button className="px-4 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/5">
                  +{categories.length - 12} More
                </button>
             )}
          </div>
        </div>
      </div>

      {/* Desktop View Table (md and up) */}
      <div className="hidden md:block bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Service Protocol</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rate/1k</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Payload Limits</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Deploy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-600 mb-6" size={40} />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] animate-pulse">Accessing Matrix...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-10 py-24 text-center">
                    <div className="bg-red-500/10 text-red-500 p-8 rounded-3xl border border-red-500/20 max-w-sm mx-auto">
                       <Zap size={24} className="mx-auto mb-3" />
                       <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : visibleServices.length > 0 ? (
                visibleServices.map((service: any) => (
                  <tr key={service.service} className="hover:bg-blue-600/5 transition-all group cursor-default">
                    <td className="px-8 py-6 font-black text-blue-600 text-xs">#{service.service}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2 mb-1.5">
                        {getStatusBadges(service.name).map((b, idx) => (
                          <span key={idx} className={`${b.color} text-[8px] font-black px-2 py-0.5 rounded-md`}>{b.text}</span>
                        ))}
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors leading-snug max-w-md">{service.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 opacity-60">
                        <Globe size={10} /> {service.category}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">${service.rate}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                        {service.min} - {service.max}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button className="bg-blue-600 text-white p-3 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-blue-600/20">
                         <PlusCircle size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Matrix scan returned 0 results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE HUD CARDS (below md) */}
      <div className="md:hidden space-y-4">
        {loading ? (
           <div className="py-20 text-center">
             <Loader2 className="mx-auto animate-spin text-blue-600 mb-4" />
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] animate-pulse">Syncing Services...</p>
           </div>
        ) : visibleServices.map((service: any) => (
          <div key={service.service} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-200 dark:border-white/10 active:scale-[0.98] transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-1 rounded-md tracking-widest">ID: {service.service}</span>
                    <div className="flex gap-1">
                      {getStatusBadges(service.name).map((b, idx) => (
                        <span key={idx} className={`${b.color} text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase`}>{b.text}</span>
                      ))}
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm leading-[1.3] tracking-tight">{service.name}</h4>
               </div>
               <button className="shrink-0 w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                 <PlusCircle size={20} />
               </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100 dark:border-white/5">
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Rate / 1k</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">${service.rate}</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Limits</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{service.min.toLocaleString()} - {service.max.toLocaleString()}</p>
               </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
               <Globe size={10} className="text-slate-400" />
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{service.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && filteredServices.length > visibleCount && (
        <div className="flex flex-col items-center gap-6 py-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Showing {visibleCount} of {filteredServices.length} protocols
          </p>
          <button 
            onClick={handleLoadMore}
            className="group flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-10 py-5 rounded-[1.5rem] font-black text-sm text-slate-900 dark:text-white hover:border-blue-500 hover:text-blue-500 transition-all shadow-xl shadow-black/5"
          >
            Load More Matrix Nodes <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredServices.length === 0 && (
         <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
               <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">No Active Nodes Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Try adjusting your search parameters or category filter.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="mt-8 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
            >
              Reset All Command Filters
            </button>
         </div>
      )}
    </div>
  );
}
