import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight, RotateCcw, Box, Car, Anchor, Layers } from 'lucide-react';
import { cn } from '../../../utils';

type Scenario = 'inclined-plane' | 'circular-motion' | 'hanging-mass' | 'pushed-block';

interface Force {
  name: string;
  symbol: string;
  angle: number; // degrees, 0 is right, 90 is down
  magnitude: number;
  color: string;
  description: string;
}

const SCENARIOS: Record<Scenario, { name: string; icon: any; forces: Force[]; description: string }> = {
  'inclined-plane': {
    name: 'Inclined Plane',
    icon: Layers,
    description: 'A block resting on a slope. Gravity acts vertically, while Normal force is perpendicular to the surface.',
    forces: [
      { name: 'Gravity', symbol: 'F_g', angle: 90, magnitude: 100, color: 'text-rose-400', description: 'Acts vertically downwards towards the centre of the Earth.' },
      { name: 'Normal', symbol: 'F_N', angle: -45, magnitude: 70, color: 'text-blue-400', description: 'Acts perpendicular to the surface of contact.' },
      { name: 'Friction', symbol: 'F_f', angle: 135, magnitude: 50, color: 'text-emerald-400', description: 'Acts parallel to the surface, opposing the tendency of motion.' }
    ]
  },
  'circular-motion': {
    name: 'Circular Motion',
    icon: Car,
    description: 'A car turning a corner on a flat road. Friction provides the centripetal force.',
    forces: [
      { name: 'Gravity', symbol: 'F_g', angle: 90, magnitude: 100, color: 'text-rose-400', description: 'Weight of the car acting downwards.' },
      { name: 'Normal', symbol: 'F_N', angle: -90, magnitude: 100, color: 'text-blue-400', description: 'Support force from the road.' },
      { name: 'Friction', symbol: 'F_f', angle: 180, magnitude: 80, color: 'text-emerald-400', description: 'Static friction acting towards the centre of the turn, providing centripetal acceleration.' }
    ]
  },
  'hanging-mass': {
    name: 'Hanging Mass',
    icon: Anchor,
    description: 'A mass suspended by a string in equilibrium.',
    forces: [
      { name: 'Gravity', symbol: 'F_g', angle: 90, magnitude: 100, color: 'text-rose-400', description: 'Weight acting downwards.' },
      { name: 'Tension', symbol: 'F_T', angle: -90, magnitude: 100, color: 'text-gold', description: 'Pulling force exerted by the string.' }
    ]
  },
  'pushed-block': {
    name: 'Pushed Block',
    icon: Box,
    description: 'A block being pushed across a rough horizontal floor.',
    forces: [
      { name: 'Gravity', symbol: 'F_g', angle: 90, magnitude: 100, color: 'text-rose-400', description: 'Weight of the block.' },
      { name: 'Normal', symbol: 'F_N', angle: -90, magnitude: 100, color: 'text-blue-400', description: 'Reaction force from the floor.' },
      { name: 'Applied', symbol: 'F_app', angle: 0, magnitude: 120, color: 'text-purple-400', description: 'External force pushing the block.' },
      { name: 'Friction', symbol: 'F_f', angle: 180, magnitude: 60, color: 'text-emerald-400', description: 'Opposes the motion of the block.' }
    ]
  }
};

export default function ForceDiagramSim() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('inclined-plane');
  const [showLabels, setShowLabels] = useState(true);

  const scenario = SCENARIOS[selectedScenario];

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex flex-col">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold z-20">
          <Box size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Free Body Diagram Explorer</span>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          {/* Background Elements based on scenario */}
          {selectedScenario === 'inclined-plane' && (
            <div className="absolute w-[600px] h-[600px] border-b-4 border-slate-700 origin-bottom-left rotate-[-45deg] translate-y-40 translate-x-[-100px]" />
          )}
          {selectedScenario === 'pushed-block' && (
            <div className="absolute w-full h-1 bg-slate-700 bottom-1/2 translate-y-12" />
          )}
          {selectedScenario === 'hanging-mass' && (
            <div className="absolute w-1 h-40 bg-slate-700 top-0" />
          )}

          {/* The Object */}
          <motion.div 
            key={selectedScenario}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "relative z-10 w-24 h-24 flex items-center justify-center rounded-xl border-2 shadow-2xl",
              selectedScenario === 'circular-motion' ? "bg-emerald-500/20 border-emerald-400/50" : "bg-white/5 border-white/10"
            )}
            style={{ 
              rotate: selectedScenario === 'inclined-plane' ? -45 : 0,
              translateY: selectedScenario === 'hanging-mass' ? 80 : 0
            }}
          >
            <scenario.icon size={40} className="text-white/20" />
            
            {/* Force Vectors */}
            {scenario.forces.map((force, i) => {
              const rad = (force.angle * Math.PI) / 180;
              const x = Math.cos(rad) * force.magnitude;
              const y = Math.sin(rad) * force.magnitude;
              
              return (
                <div key={i} className="absolute pointer-events-none">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: force.magnitude }}
                    className={cn("h-1 origin-left relative", force.color.replace('text-', 'bg-'))}
                    style={{ 
                      transform: `rotate(${force.angle}deg)`,
                      boxShadow: '0 0 10px currentColor'
                    }}
                  >
                    {/* Arrow Head */}
                    <div 
                      className={cn("absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8", force.color.replace('text-', 'border-l-'))}
                    />
                    
                    {/* Label */}
                    {showLabels && (
                      <div 
                        className={cn("absolute -right-12 top-1/2 -translate-y-1/2 font-black text-xs", force.color)}
                        style={{ transform: `rotate(${-force.angle}deg)` }}
                      >
                        {force.symbol}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Force Details */}
        <div className="p-8 border-t border-white/5 bg-black/20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scenario.forces.map((f, i) => (
            <div key={i} className="space-y-1">
              <div className={cn("text-[10px] font-black uppercase tracking-widest", f.color)}>{f.name} ({f.symbol})</div>
              <p className="text-[9px] text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Theory */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Select Scenario</h3>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(SCENARIOS) as Scenario[]).map(s => {
              const Icon = SCENARIOS[s].icon;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedScenario(s)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                    selectedScenario === s 
                      ? "bg-gold/10 border-gold text-gold" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">{SCENARIOS[s].name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={cn(
                "w-full py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
                showLabels ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-white/5 text-slate-500"
              )}
            >
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Free Body Diagrams</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Golden Rules</div>
              <ul className="text-[10px] text-slate-400 space-y-2 list-disc pl-4">
                <li>Draw forces as arrows originating from the <span className="text-white font-bold">centre of mass</span>.</li>
                <li>The length of the arrow represents the <span className="text-white font-bold">magnitude</span>.</li>
                <li>Only include forces acting <span className="text-gold font-bold">ON</span> the object, not by it.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-2">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest">Circular Motion Nuance</div>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                In circular motion, friction does not always oppose the velocity. 
                For a car turning on a flat road, <span className="text-white font-bold">static friction</span> acts perpendicular to the velocity, pointing towards the centre of the circle to provide the <span className="text-gold font-bold">centripetal force</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
