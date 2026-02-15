import React, { useState, useEffect } from 'react';
import {
  Ticket,
  MessageCircle,
  CheckCircle,
  Clock,
  PlusCircle,
  Mail,
  ArrowUpRight,
  X,
  Send,
  Loader,
  Inbox,
} from 'lucide-react';
import { auth } from './firebase'; 

interface Ticket {
  id: string;
  subject: string;
  priority: string;
  description: string;
  status: string;
  createdAt: string;
  userEmail: string;
  userName: string;
  userId: string;
}

const priorityColors: Record<string, string> = {
  Low: 'text-slate-500 bg-slate-500/10',
  Medium: 'text-blue-500 bg-blue-500/10',
  High: 'text-orange-500 bg-orange-500/10',
  Urgent: 'text-red-500 bg-red-500/10',
};

export default function TicketsView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Medium',
    description: ''
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get current user from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          fullName: currentUser.displayName,
          uid: currentUser.uid,
          photoURL: currentUser.photoURL
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Load tickets from localStorage on mount
  useEffect(() => {
    if (user?.uid) {
      const savedTickets = localStorage.getItem(`supportTickets_${user.uid}`);
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      }
    }
  }, [user]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCreateModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.email) {
      alert('You must be logged in to create a ticket');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userEmail: user.email,
          userName: user.fullName || user.email.split('@')[0] || 'User',
          userId: user.uid
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newTicket: Ticket = {
          id: result.ticketId,
          ...formData,
          status: 'Open',
          createdAt: new Date().toISOString(),
          userEmail: user.email,
          userName: user.fullName || user.email.split('@')[0] || 'User',
          userId: user.uid
        };

        const userTicketsKey = `supportTickets_${user.uid}`;
        const updatedTickets = [newTicket, ...tickets];
        setTickets(updatedTickets);
        localStorage.setItem(userTicketsKey, JSON.stringify(updatedTickets));

        setShowSuccessMessage(true);
        setFormData({ subject: '', priority: 'Medium', description: '' });
        setIsCreateModalOpen(false);
      } else {
        alert('Failed to create ticket: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: tickets.length
  };

  if (!user) {
    return (
      <div className="animate-fade-in space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 sm:py-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
            <Ticket size={32} className="sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
            Please Login
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 px-4">
            You need to be logged in to create and view support tickets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with CTA - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Support Tickets
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]">
              Customer Support
            </p>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <p className="text-blue-600 font-black text-[8px] sm:text-[10px] uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">
              {user.fullName || user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> 
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Success Message - Mobile Optimized */}
      {showSuccessMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start sm:items-center gap-3 sm:gap-4 animate-slide-down">
          <CheckCircle size={20} className="sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-xs sm:text-sm">Ticket Created Successfully!</p>
            <p className="text-[10px] sm:text-xs opacity-80 mt-1 truncate">
              Our team will contact you at {user.email}
            </p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="flex-shrink-0 hover:opacity-70"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      )}

      {/* Stats Card - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-full sm:max-w-xs">
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white bg-purple-600 shadow-lg">
              <Inbox size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">
              Total
            </span>
          </div>
          <p className="text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
            Your Tickets
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {stats.total}
          </h3>
        </div>
      </div>

      {/* Tickets List - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="bg-white dark:bg-[#0f172a]/40 p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-white/5">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-black tracking-tight uppercase tracking-widest text-xs text-slate-400">
              Your Submitted Tickets
            </h3>
            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl">
              {tickets.length} total
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-blue-600/5 transition-all cursor-default gap-3 sm:gap-0"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm border border-slate-100 dark:border-white/5 flex-shrink-0">
                      <Mail size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                          {ticket.subject}
                        </p>
                        <span
                          className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${
                            priorityColors[ticket.priority]
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="truncate max-w-[60px] sm:max-w-none">#{ticket.id}</span>
                        <span className="flex-shrink-0">•</span>
                        <span className="flex-shrink-0">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span className="hidden xs:inline flex-shrink-0">•</span>
                        <span className="hidden xs:block truncate max-w-[120px] sm:max-w-[200px]">
                          {ticket.description.substring(0, 30)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 pl-12 sm:pl-0">
                    <span className="text-[8px] sm:text-[9px] font-black text-green-600 bg-green-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      {ticket.status}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 sm:w-[18px] sm:h-[18px]"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl flex items-center justify-center text-slate-400 mb-3 sm:mb-4">
                  <Inbox size={24} className="sm:w-8 sm:h-8" />
                </div>
                <p className="text-slate-500 font-black text-xs sm:text-sm uppercase tracking-widest">
                  No tickets yet
                </p>
                <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold mt-1 px-4">
                  Create your first support ticket
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 sm:mt-6 flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs hover:scale-105 transition-all"
                >
                  <PlusCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Create Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal - Mobile Optimized */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] sm:rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-8">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Create New Ticket</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateTicket}>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full mt-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full mt-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/30 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>
                  
                  {/* User info preview */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-800/30">
                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                      Submitting as:
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {user.photoURL && (
                        <img 
                          src={user.photoURL} 
                          alt={user.fullName}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                          {user.fullName || user.email.split('@')[0]}
                        </p>
                        <p className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-full sm:flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 font-black text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors order-2 sm:order-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black shadow-xl shadow-blue-600/20 text-xs sm:text-sm hover:scale-[1.02] sm:hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={14} className="sm:w-4 sm:h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} className="sm:w-4 sm:h-4" />
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
