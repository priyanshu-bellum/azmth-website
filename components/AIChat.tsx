/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Terminal, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'AZMTH OS Online. Query?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-96 bg-black border border-white/20 shadow-2xl overflow-hidden font-mono"
          >
            {/* Header */}
            <div className="bg-white text-black p-3 flex justify-between items-center border-b border-white/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <h3 className="font-bold tracking-wider text-sm uppercase">AZMTH_OS v1.0</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-64 md:h-80 overflow-y-auto p-4 space-y-4 scroll-smooth bg-neutral-900"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-3 text-xs md:text-sm border ${
                      msg.role === 'user'
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-green-500 border-green-900/50'
                    }`}
                  >
                    <span className="opacity-50 block text-[10px] mb-1 uppercase tracking-wider">
                        {msg.role === 'user' ? 'USER_INPUT' : 'SYS_OUTPUT'}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black border border-green-900/50 p-3 text-green-500 text-xs animate-pulse">
                    PROCESSING...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/20 bg-black flex gap-2">
                <div className="flex items-center text-white/50">{'>'}</div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none font-mono"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-white text-black p-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white z-50 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;