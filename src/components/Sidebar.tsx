import React from 'react';
import { Simulation } from '../types';
import { BookOpen, GraduationCap, Info } from 'lucide-react';

interface SidebarProps {
  simulation: Simulation;
  onOpenTheory: () => void;
  onOpenNotes: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ simulation, onOpenTheory, onOpenNotes }) => {
  return (
    <div className="w-80 h-full glass-panel flex flex-col border-r border-white/10">
      <div className="p-8 border-b border-white/10">
        <h1 className="text-2xl font-bold text-gold mb-2 leading-tight">{simulation.name}</h1>
        <div className="space-y-4 mt-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Unit</span>
            <span className="text-slate-200 font-medium">{simulation.unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Area of Study</span>
            <span className="text-slate-200 font-medium">{simulation.aos}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Topic</span>
            <span className="text-slate-200 font-medium">{simulation.topic}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Subtopic</span>
            <span className="text-slate-200 font-medium">{simulation.subtopic}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 space-y-4">
        <div className="p-4 rounded-xl bg-midnight border border-white/5">
          <div className="flex items-center gap-2 text-gold mb-2">
            <Info size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {simulation.description}
          </p>
        </div>

        <button
          onClick={onOpenTheory}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-midnight-light border border-white/10 hover:border-gold/50 hover:bg-midnight transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-midnight transition-colors">
              <BookOpen size={20} />
            </div>
            <span className="font-semibold text-slate-200">Theory</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        </button>

        <button
          onClick={onOpenNotes}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-midnight-light border border-white/10 hover:border-gold/50 hover:bg-midnight transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-200 group-hover:text-midnight transition-colors">
              <GraduationCap size={20} />
            </div>
            <span className="font-semibold text-slate-200">Teacher's Notes</span>
          </div>
        </button>
      </div>

      <div className="p-6 border-t border-white/10 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          VCAA Physics Simulation Hub
        </p>
      </div>
    </div>
  );
};
