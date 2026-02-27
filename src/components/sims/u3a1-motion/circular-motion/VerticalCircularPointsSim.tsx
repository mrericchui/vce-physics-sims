import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, Info, LayoutGrid } from 'lucide-react';
import { cn } from '../../../utils';

type Position = 'bottom-inner' | 'top-inner' | 'top-outer';

interface SituationProps {
  type: Position;
  mass: number;
  radius: number;
  velocity: number;
}

const SituationCard: React.FC<SituationProps> = ({ type, mass, radius, velocity }) => {
  const g = 9.8;
  const weight = mass * g;
  const centripetal = (mass * velocity * velocity) / radius;
  
  // Fnet = mv^2/r
  // Bottom Inner: N - mg = Fc => N = Fc + mg
  // Top Inner: N + mg = Fc => N = Fc - mg
  // Top Outer: mg - N = Fc => N = mg - Fc
  
  let normalForce = 0;
  let equation = "";
  let netForceDir: 'up' | 'down' = 'up';

  switch (type) {
    case 'bottom-inner':
      normalForce = centripetal + weight;
      equation = "N - mg = mv²/r";
      netForceDir = 'up';
      break;
    case 'top-inner':
      normalForce = centripetal - weight;
      equation = "N + mg = mv²/r";
      netForceDir = 'down';
      break;
    case 'top-outer':
      normalForce = weight - centripetal;
      equation = "mg - N = mv²/r";
      netForceDir = 'up'; // Wait, for outer top, center is below, so Fc is down. Fnet = mg - N = Fc.
      netForceDir = 'down';
      break;
  }

  const title = {
    'bottom-inner': 'Bottom (Inner Loop)',
    'top-inner': 'Top (Inner Loop)',
    'top-outer': 'Top (Outer Loop/Hill)'
  }[type];

  const scale = 0.5; // for vector visualization

  return (
    <div className="flex-1 glass-panel rounded-[2rem] p-8 border-white/5 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-gold uppercase tracking-widest">{title}</h4>
        <div className="text-[10px] font-mono text-slate-500">{equation}</div>
      </div>

      {/* Visual Diagram */}
      <div className="flex-1 relative flex items-center justify-center bg-white/[0.02] rounded-2xl min-h-[300px]">
        {/* Track Segment */}
        <div className={cn(
          "absolute w-48 h-48 border-4 border-white/5",
          type === 'top-outer' ? "rounded-t-full border-b-0 bottom-0" : "rounded-full"
        )} />

        {/* Object */}
        <div className={cn(
          "absolute w-12 h-12 bg-gold/20 border-2 border-gold/50 rounded-lg flex items-center justify-center z-10",
          type === 'bottom-inner' && "bottom-[10px]",
          type === 'top-inner' && "top-[10px]",
          type === 'top-outer' && "top-[-24px]"
        )}>
          <span className="text-[10px] font-black text-gold">m</span>

          {/* Force Vectors */}
          {/* Normal Force */}
          <div 
            className={cn(
              "absolute w-1 bg-emerald-500 origin-center",
              (type === 'bottom-inner' || type === 'top-outer') ? "bottom-1/2" : "top-1/2"
            )} 
            style={{ 
              height: Math.abs(normalForce) * scale,
              transform: (type === 'bottom-inner' || type === 'top-outer') ? 'translateY(0)' : 'translateY(0)'
            }}
          >
            {type === 'bottom-inner' ? <ArrowUp size={14} className="absolute top-0 -translate-y-full -left-[5px] text-emerald-500" /> : <ArrowDown size={14} className="absolute bottom-0 translate-y-full -left-[5px] text-emerald-500" />}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-black text-emerald-500">N</div>
          </div>

          {/* Weight */}
          <div className="absolute top-1/2 left-1/2 w-1 bg-rose-500 origin-top" style={{ height: weight * scale }}>
            <ArrowDown size={14} className="absolute bottom-0 -left-[5px] text-rose-500" />
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-black text-rose-500">mg</div>
          </div>
        </div>

        {/* Net Force Indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Net Force</div>
          <div className="w-1.5 h-12 bg-blue-500/20 rounded-full relative">
            <motion.div 
              animate={{ y: netForceDir === 'up' ? [-10, 10] : [10, -10] }}
              transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
              className={cn(
                "absolute left-0 w-full h-4 bg-blue-500 rounded-full",
                netForceDir === 'up' ? "top-0" : "bottom-0"
              )}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Normal Force</div>
          <div className={cn(
            "text-xl font-black",
            normalForce < 0 ? "text-rose-500" : "text-emerald-500"
          )}>
            {normalForce < 0 ? "0 (Lost Contact)" : `${normalForce.toFixed(0)} N`}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Net Force (mv²/r)</div>
          <div className="text-xl font-black text-blue-500">{centripetal.toFixed(0)} N</div>
        </div>
      </div>

      {/* Comparison Text */}
      <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 text-[11px] leading-relaxed text-slate-400 italic">
        {type === 'bottom-inner' && "Normal force must overcome weight AND provide centripetal force. You feel HEAVIEST here."}
        {type === 'top-inner' && "Weight helps provide centripetal force, so Normal force is reduced. If speed is too low, contact is lost."}
        {type === 'top-outer' && "Normal force is reduced by centripetal requirement. If speed is too high, you fly off the track."}
      </div>
    </div>
  );
};

export default function VerticalCircularPointsSim() {
  const [mass, setMass] = useState(50); // kg
  const [radius, setRadius] = useState(10); // m
  const [velocity, setVelocity] = useState(15); // m/s
  
  const [slot1, setSlot1] = useState<Position>('bottom-inner');
  const [slot2, setSlot2] = useState<Position>('top-inner');

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
      {/* Header Controls */}
      <div className="glass-panel rounded-3xl p-8 border-white/5 flex flex-wrap items-center justify-between gap-8">
        <div className="flex gap-12">
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mass (kg)</label>
              <span className="text-xs font-black text-white">{mass}</span>
            </div>
            <input type="range" min="10" max="200" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Radius (m)</label>
              <span className="text-xs font-black text-white">{radius}</span>
            </div>
            <input type="range" min="5" max="30" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Velocity (m/s)</label>
              <span className="text-xs font-black text-white">{velocity}</span>
            </div>
            <input type="range" min="1" max="30" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-40 accent-gold" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Compare Situations</div>
           <div className="flex gap-2">
             <select 
               value={slot1} 
               onChange={(e) => setSlot1(e.target.value as Position)}
               className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold/50"
             >
               <option value="bottom-inner">Bottom Inner</option>
               <option value="top-inner">Top Inner</option>
               <option value="top-outer">Top Outer</option>
             </select>
             <select 
               value={slot2} 
               onChange={(e) => setSlot2(e.target.value as Position)}
               className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold/50"
             >
               <option value="bottom-inner">Bottom Inner</option>
               <option value="top-inner">Top Inner</option>
               <option value="top-outer">Top Outer</option>
             </select>
           </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-[600px]">
        <SituationCard type={slot1} mass={mass} radius={radius} velocity={velocity} />
        <SituationCard type={slot2} mass={mass} radius={radius} velocity={velocity} />
      </div>
    </div>
  );
}
