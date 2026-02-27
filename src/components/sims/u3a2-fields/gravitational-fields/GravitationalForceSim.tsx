import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Info, Zap, ArrowDown, Globe, Orbit, User, Apple } from 'lucide-react';
import { cn } from '../../../utils';

interface BodyType {
  name: string;
  mass: number; // kg
  radius: number; // m
  color: string;
  Icon: React.ElementType;
}

const BODIES: BodyType[] = [
  { name: 'Earth', mass: 5.97e24, radius: 6.37e6, color: 'text-blue-400', Icon: Globe },
  { name: 'Moon', mass: 7.35e22, radius: 1.74e6, color: 'text-slate-400', Icon: Orbit },
  { name: 'Mars', mass: 6.39e23, radius: 3.39e6, color: 'text-rose-400', Icon: Globe },
];

interface ObjectType {
  name: string;
  mass: number; // kg
  Icon: React.ElementType;
}

const OBJECTS: ObjectType[] = [
  { name: 'Satellite', mass: 2000, Icon: Orbit },
  { name: 'Person', mass: 70, Icon: User },
  { name: 'Apple', mass: 0.1, Icon: Apple },
];

export default function GravitationalForceSim() {
  const [selectedBody, setSelectedBody] = useState(BODIES[0]);
  const [selectedObject, setSelectedObject] = useState(OBJECTS[0]);
  const [altitude, setAltitude] = useState(400000); // m (400km - ISS altitude)

  const G = 6.674e-11;
  const r = selectedBody.radius + altitude;
  
  // g = GM/r^2
  const fieldStrength = (G * selectedBody.mass) / (r * r);
  // F = mg
  const force = selectedObject.mass * fieldStrength;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
          <Globe size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Field Visualisation</span>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          {/* Central Body */}
          <div className={cn("relative z-10 transition-all duration-500", selectedBody.color)}>
            <selectedBody.Icon size={120} />
            <div className="absolute inset-0 bg-current opacity-10 blur-3xl rounded-full" />
          </div>

          {/* Radial Field Lines (Simplified) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 2 * Math.PI;
              const x1 = 50 + 10 * Math.cos(angle);
              const y1 = 50 + 10 * Math.sin(angle);
              const x2 = 50 + 40 * Math.cos(angle);
              const y2 = 50 + 40 * Math.sin(angle);
              return (
                <line 
                  key={i} 
                  x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} 
                  stroke="white" strokeWidth="1" strokeDasharray="4 4"
                />
              );
            })}
          </svg>

          {/* Orbiting Object */}
          <motion.div
            animate={{ 
              rotate: 360 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute"
            style={{ width: 300 + (altitude / 1e6) * 20, height: 300 + (altitude / 1e6) * 20 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="text-gold bg-slate-900/80 p-2 rounded-full border border-gold/20 shadow-lg">
                <selectedObject.Icon size={20} />
              </div>
              
              {/* Force Vector */}
              <div className="mt-2 w-1 bg-emerald-500 origin-top" style={{ height: Math.min(100, fieldStrength * 10) }}>
                <ArrowDown size={14} className="absolute bottom-0 -left-[5px] text-emerald-500" />
                <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-black text-emerald-500 whitespace-nowrap">
                  g = {fieldStrength.toFixed(2)} N/kg
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls & Data */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        {/* Selection Panel */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Central Body</label>
            <div className="grid grid-cols-3 gap-2">
              {BODIES.map(b => (
                <button
                  key={b.name}
                  onClick={() => setSelectedBody(b)}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex flex-col items-center gap-2",
                    selectedBody.name === b.name 
                      ? "bg-gold/10 border-gold text-gold" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                  )}
                >
                  <b.Icon size={24} />
                  <span className="text-[10px] font-bold">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Test Object</label>
            <div className="grid grid-cols-3 gap-2">
              {OBJECTS.map(o => (
                <button
                  key={o.name}
                  onClick={() => setSelectedObject(o)}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex flex-col items-center gap-2",
                    selectedObject.name === o.name 
                      ? "bg-gold/10 border-gold text-gold" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                  )}
                >
                  <o.Icon size={20} />
                  <span className="text-[10px] font-bold">{o.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Altitude (km)</label>
              <span className="text-xs font-black text-white">{(altitude / 1000).toFixed(0)}</span>
            </div>
            <input 
              type="range" min="0" max="20000000" step="100000" value={altitude} 
              onChange={(e) => setAltitude(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Zap size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Calculations</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Field Strength (g)</div>
              <div className="text-2xl font-black text-white">{fieldStrength.toFixed(3)} <span className="text-xs text-slate-500">N/kg</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
              <div className="text-[10px] font-black text-gold uppercase mb-1">Gravitational Force (F_g)</div>
              <div className="text-2xl font-black text-white">{force.toFixed(2)} <span className="text-xs text-slate-500">N</span></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Physics Note</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              The field strength $g$ depends only on the central mass and distance. 
              The force $F_g$ is the result of the field acting on the test object's mass.
              {"$F_g = m \\cdot g = \\frac{G M m}{r^2}$"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
