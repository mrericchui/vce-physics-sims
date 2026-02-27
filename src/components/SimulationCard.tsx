import React from 'react';
import { motion } from 'motion/react';
import { Simulation } from '../types';
import { Play, Activity, Construction } from 'lucide-react';
import { cn } from '../utils';

interface SimulationCardProps {
  simulation: Simulation;
  onClick: () => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, onClick }) => {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Fundamental':
        return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      case 'Advanced':
        return "text-rose-500 border-rose-500/20 bg-rose-500/5";
      default:
        return "text-gold border-gold/20 bg-gold/5";
    }
  };

  return (
    <motion.div
      whileHover={simulation.isReady ? { y: -4 } : {}}
      className={cn(
        "group glass-panel rounded-[2rem] p-8 flex flex-col h-full border-white/5 transition-all duration-500",
        simulation.isReady ? "hover:border-gold/20" : "grayscale opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border",
          getDifficultyStyles(simulation.difficulty)
        )}>
          {simulation.difficulty}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          {simulation.aos.replace(/\s/g, '-').toLowerCase()}
        </span>
      </div>

      <div className="flex-1">
        <h3 className={cn(
          "text-3xl font-black text-white mb-2 leading-tight tracking-tight transition-colors",
          simulation.isReady && "group-hover:text-gold"
        )}>
          {simulation.name}
        </h3>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-6">
          {simulation.aos}
        </p>
        
        <p className="text-sm text-slate-400 leading-relaxed mb-8 line-clamp-3">
          {simulation.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {simulation.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black tracking-widest px-3 py-1 rounded bg-white/5 text-slate-500 uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        {simulation.isReady ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Lab Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Construction size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Under Construction</span>
          </div>
        )}
        
        <button
          onClick={simulation.isReady ? onClick : undefined}
          disabled={!simulation.isReady}
          className={cn(
            "flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(251,191,36,0.15)]",
            simulation.isReady 
              ? "bg-gold hover:bg-gold-dark text-black active:scale-95" 
              : "bg-white/5 text-slate-600 cursor-not-allowed shadow-none"
          )}
        >
          {simulation.isReady ? 'Launch' : 'Locked'}
          {simulation.isReady && <Play size={14} fill="currentColor" />}
        </button>
      </div>
    </motion.div>
  );
};
