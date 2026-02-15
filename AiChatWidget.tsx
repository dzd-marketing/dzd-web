import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  ChevronDown,
  Sparkles,
  Code,
  PenTool,
  HelpCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatToggleRef = useRef<HTMLButtonElement>(null);

  const API_ENDPOINT = "https://chat-widget-blue.vercel.app/api/chat";
  const CONVERSATION_KEY = 'dzd_chat_history';
  const MAX_HISTORY_LENGTH = 20;

  // Load saved conversation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONVERSATION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading conversation:', e);
    }
  }, []);

  // Save conversation
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving conversation:', e);
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle click outside to close on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth <= 768 && 
          isOpen && 
          chatWindowRef.current && 
          chatToggleRef.current &&
          !chatWindowRef.current.contains(e.target as Node) &&
          !chatToggleRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px';
  };

  const handleQuickAction = (action: string) => {
    let prompt = '';
    switch (action) {
      case 'code':
        prompt = "Help me with some coding problems.";
        break;
      case 'write':
        prompt = "Help me write something creative.";
        break;
      case 'explain':
        prompt = "Explain a complex topic in simple terms.";
        break;
    }
    setInputValue(prompt);
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
      chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 80) + 'px';
      chatInputRef.current.focus();
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi! I'm your AI assistant. How can I help you today?"
      }
    ]);
    localStorage.removeItem(CONVERSATION_KEY);
  };

  const sendMessage = async () => {
    if (isStreaming || !inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
    }

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Show typing indicator
    setShowTyping(true);
    setIsStreaming(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: messages.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      setShowTyping(false);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiResponse += chunk;

        // Update the last message (assistant's response)
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = aiResponse;
          } else {
            newMessages.push({ role: 'assistant', content: aiResponse });
          }
          
          return newMessages;
        });

        // Small delay for smoother animation
        await new Promise(resolve => setTimeout(resolve, 20));
      }

    } catch (error) {
      console.error('Chat error:', error);
      setShowTyping(false);
      
      const errorMessage = error instanceof Error && error.message.includes('Failed to fetch')
        ? 'Network error. Please check your connection.'
        : 'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div id="aiChatWidget" className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-[9999]">
      {/* Chat Toggle Button */}
      <button
        ref={chatToggleRef}
        onClick={toggleChat}
        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 hover:shadow-blue-600/30"
      >
        {isOpen ? <X size={20} className="md:w-6 md:h-6" /> : <MessageCircle size={20} className="md:w-6 md:h-6" />}
      </button>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`absolute bottom-14 md:bottom-16 right-0 w-[calc(100vw-2rem)] md:w-96 max-w-md h-[550px] md:h-[600px] bg-white dark:bg-[#0d0d1c] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 md:p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <Bot size={16} className="md:w-5 md:h-5" />
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-400 border-2 border-blue-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base leading-tight">AI Assistant</h3>
              <p className="text-xs text-white/80">Online • DzD Marketing</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="hover:bg-white/10 rounded-lg p-1 transition-colors"
          >
            <X size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50 dark:bg-[#100f23]"
          style={{ scrollbarWidth: 'thin' }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="bg-blue-600/10 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border border-blue-600/20 shrink-0">
                    <Bot size={12} className="text-blue-600 md:w-4 md:h-4" />
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-blue-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider ml-1">
                      AI Assistant
                    </p>
                    <div className="text-sm font-normal leading-relaxed rounded-xl rounded-bl-none px-3 md:px-4 py-2 md:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-slate-200 dark:border-gray-700">
                      {msg.content}
                    </div>
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-wider mr-1">
                    You
                  </p>
                  <div className="text-sm font-normal leading-relaxed rounded-xl rounded-br-none px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {showTyping && (
            <div className="flex items-end gap-2">
              <div className="bg-blue-600/10 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border border-blue-600/20">
                <Bot size={12} className="text-blue-600" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-full px-4 py-2 flex gap-1 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 pt-3 flex gap-2 flex-wrap bg-white dark:bg-[#100f23] border-t border-slate-200 dark:border-gray-800">
          <button
            onClick={() => handleQuickAction('code')}
            className="h-7 md:h-8 px-3 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            <Code size={12} /> Code
          </button>
          <button
            onClick={() => handleQuickAction('write')}
            className="h-7 md:h-8 px-3 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            <PenTool size={12} /> Writing
          </button>
          <button
            onClick={() => handleQuickAction('explain')}
            className="h-7 md:h-8 px-3 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500/50 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            <HelpCircle size={12} /> Explain
          </button>
          <button
            onClick={clearChatHistory}
            className="h-7 md:h-8 px-3 rounded-full bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-red-500/50 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all text-xs font-medium text-gray-700 dark:text-gray-300 ml-auto"
          >
            <span className="text-[10px]">Clear</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white dark:bg-[#100f23] border-t border-slate-200 dark:border-gray-800">
          <div className="relative flex items-center gap-2 bg-slate-100 dark:bg-gray-800/50 rounded-xl border border-slate-200 dark:border-gray-700 p-1 focus-within:border-blue-500/50 transition-colors">
            <textarea
              ref={chatInputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoResizeTextarea(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm py-2 px-3 resize-none max-h-20 outline-none"
              disabled={isStreaming}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !inputValue.trim()}
              className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[8px] md:text-[9px] text-gray-500 dark:text-gray-600 uppercase tracking-wider font-medium flex items-center justify-center gap-1">
              <Sparkles size={10} /> Powered by DzD AI Labs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
