import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRICULUM } from '../types';
import { 
  LayoutGrid, 
  ChevronDown, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  User, 
  BookMarked, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { cn } from '../utils';

interface MainSidebarProps {
  activeTopic: string | null;
  onTopicSelect: (topic: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ activeTopic, onTopicSelect }) => {
  const [expandedUnits, setExpandedUnits] = useState<string[]>(['u4-aos1']);

  const toggleUnit = (id: string) => {
    setExpandedUnits(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-72 h-screen bg-black border-r border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          <Zap size={28} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none text-white">PHYSICS</h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Simulations</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-8">
        <div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors group">
            <LayoutGrid size={18} className="group-hover:text-gold transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest">All Laboratory</span>
          </button>
        </div>

        {/* Unit Directories */}
        <div className="space-y-4">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Unit Directories</h3>
          <div className="space-y-2">
            {CURRICULUM.map((aos) => (
              <div key={aos.id} className="space-y-1">
                <button
                  onClick={() => toggleUnit(aos.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all text-left",
                    expandedUnits.includes(aos.id) ? "text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {expandedUnits.includes(aos.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-[11px] font-black tracking-wider uppercase">{aos.code} {aos.title}</span>
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedUnits.includes(aos.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-8 border-l border-white/5 ml-6 space-y-1"
                    >
                      {aos.topics.map((topic) => (
                        <button
                          key={topic.name}
                          onClick={() => onTopicSelect(topic.name)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            activeTopic === topic.name 
                              ? "text-gold border-l-2 border-gold -ml-[1px]" 
                              : "text-slate-600 hover:text-slate-400"
                          )}
                        >
                          {topic.name.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="space-y-4">
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Information</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors group">
              <Info size={18} className="group-hover:text-gold" />
              <span className="text-xs font-bold uppercase tracking-widest">Teacher's Note</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors group">
              <ShieldCheck size={18} className="group-hover:text-gold" />
              <span className="text-xs font-bold uppercase tracking-widest">Legal</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer Cards */}
      <div className="p-6 space-y-4">
        {/* Author Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gold/10 text-gold">
              <User size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</span>
          </div>
          <h4 className="text-lg font-black text-white leading-none mb-1">Eric Chui</h4>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider italic">Purely for educational purposes</p>
        </div>

        {/* Resources Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gold/10 text-gold">
              <BookMarked size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resources</span>
          </div>
          <div className="space-y-3">
            <a href="https://www.vcaa.vic.edu.au/Documents/viccurric/physics/PhysicsSD-2023.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-gold transition-colors">
              <span>Formula Sheet (VCAA)</span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
            <a href="https://www.vcaa.vic.edu.au/curriculum/vce/vce-study-designs/physics/Pages/index.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-gold transition-colors">
              <span>VCE Study Design</span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
            <a href="https://www.vicphysics.org/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-gold transition-colors">
              <span>VicPhysics Resources</span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
            <a href="https://Checkpoints.com.au" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-[11px] font-bold text-slate-300 hover:text-gold transition-colors">
              <span>VCE Checkpoints</span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
