
import React from 'react';
import { PhysicsSim } from '../types';
import { Play, Tag } from 'lucide-react';

interface SimCardProps {
  sim: PhysicsSim;
}

const SimCard: React.FC<SimCardProps> = ({ sim }) => {
  const diffColors = {
    Foundation: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Standard: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    Advanced: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  const isComingSoon = sim.link === "#";

  return (
    <div className="group bg-zinc-900 border border-zinc-800 p-6 rounded-2xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-tighter ${diffColors[sim.difficulty]}`}>
          {sim.difficulty}
        </span>
        <div className="flex gap-2">
           <span className="text-[10px] text-zinc-500 font-mono">{sim.aos.split(':')[0]}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors leading-tight">
        {sim.title}
      </h3>
      
      <p className="text-zinc-400 text-sm mb-6 flex-grow">
        {sim.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {sim.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-auto">
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{sim.subtopic}</p>
        
        {isComingSoon ? (
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Coming Soon</span>
        ) : (
          <a 
            href={sim.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer"
          >
            Launch <Play size={12} className="fill-amber-500" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SimCard;
