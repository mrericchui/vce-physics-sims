
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { askPhysicsTutor } from '../services/geminiService';
import { Message } from '../types';

const PhysicsTutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI Physics Tutor. Struggling with a concept in Unit 3 or 4? Ask me anything about forces, fields, or matter waves!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askPhysicsTutor(input);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble thinking right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-amber-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 font-bold z-50 group"
      >
        <Bot size={24} />
        <span className="hidden group-hover:block pr-2">Physics Tutor</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-96 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all ${isMinimized ? 'h-16 overflow-hidden' : 'h-[500px]'}`}>
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Bot size={18} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Physics Tutor</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-zinc-500 hover:text-white p-1">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-amber-500 text-black font-medium rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 text-zinc-300 p-3 rounded-2xl border border-zinc-800 flex gap-2">
                   <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="relative group">
              <input 
                type="text"
                placeholder="Ask about gravity, waves..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-3 top-2.5 p-1.5 bg-amber-500 text-black rounded-lg hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 text-center flex items-center justify-center gap-1">
              <Sparkles size={10} /> Powered by Gemini Pro
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PhysicsTutor;
