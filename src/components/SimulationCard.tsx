import React from 'react';
import { motion } from 'motion/react';
import { Simulation } from '../types';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface SimulationCardProps {
  simulation: Simulation;
  onClick: () => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, onClick }) => {
  // @ts-ignore
  const Icon = Icons[simulation.icon] || Icons.Activity;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group cursor-pointer glass-panel rounded-2xl p-6 hover:border-gold/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-midnight transition-colors">
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-slate-500">
          {simulation.unit}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-gold transition-colors">
        {simulation.name}
      </h3>
      
      <p className="text-sm text-slate-400 line-clamp-2 mb-6">
        {simulation.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-xs text-slate-500 font-medium">{simulation.topic}</span>
        <ArrowRight size={16} className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
      </div>
    </motion.div>
  );
};
