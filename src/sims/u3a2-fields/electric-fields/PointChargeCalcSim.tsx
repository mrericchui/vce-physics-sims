import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Info, LayoutGrid, Calculator } from 'lucide-react';
import { cn } from '../../../utils';

type ConfigType = 'collinear-2' | 'collinear-3' | 'right-angle' | 'square';

interface Charge {
  id: number;
  x: number; // in meters relative to center
  y: number;
  q: number; // in microCoulombs (uC)
}

export default function PointChargeCalcSim() {
  const [config, setConfig] = useState<ConfigType>('collinear-2');
  const [q1, setQ1] = useState(5); // uC
  const [q2, setQ2] = useState(-5); // uC
  const [q3, setQ3] = useState(5); // uC
  const [q4, setQ4] = useState(-5); // uC
  const [dist, setDist] = useState(0.5); // m

  const k = 8.99e9; // Coulomb's constant

  const charges = useMemo(() => {
    switch (config) {
      case 'collinear-2':
        return [
          { id: 1, x: -dist/2, y: 0, q: q1 },
          { id: 2, x: dist/2, y: 0, q: q2 }
        ];
      case 'collinear-3':
        return [
          { id: 1, x: -dist, y: 0, q: q1 },
          { id: 2, x: 0, y: 0, q: q2 },
          { id: 3, x: dist, y: 0, q: q3 }
        ];
      case 'right-angle':
        return [
          { id: 1, x: 0, y: dist, q: q1 },
          { id: 2, x: 0, y: 0, q: q2 },
          { id: 3, x: dist, y: 0, q: q3 }
        ];
      case 'square':
        return [
          { id: 1, x: -dist/2, y: dist/2, q: q1 },
          { id: 2, x: dist/2, y: dist/2, q: q2 },
          { id: 3, x: dist/2, y: -dist/2, q: q3 },
          { id: 4, x: -dist/2, y: -dist/2, q: q4 }
        ];
      default:
        return [];
    }
  }, [config, q1, q2, q3, q4, dist]);

  // Calculate net force on charge 2 (usually the center or corner one)
  const netForceOn2 = useMemo(() => {
    if (charges.length < 2) return { fx: 0, fy: 0, mag: 0 };
    const target = charges.find(c => c.id === 2);
    if (!target) return { fx: 0, fy: 0, mag: 0 };

    let fx = 0;
    let fy = 0;

    charges.forEach(c => {
      if (c.id === target.id) return;
      const dx = target.x - c.x;
      const dy = target.y - c.y;
      const r2 = dx * dx + dy * dy;
      const r = Math.sqrt(r2);
      
      // F = k * q1 * q2 / r^2
      // q is in uC, so multiply by 1e-6
      const forceMag = (k * Math.abs(target.q * 1e-6) * Math.abs(c.q * 1e-6)) / r2;
      
      // Direction: if same sign, repulsive (away from c)
      const sign = (target.q * c.q > 0) ? 1 : -1;
      fx += sign * forceMag * (dx / r);
      fy += sign * forceMag * (dy / r);
    });

    return { fx, fy, mag: Math.sqrt(fx * fx + fy * fy) };
  }, [charges]);

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
          <LayoutGrid size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Configuration Viewer</span>
        </div>

        <div className="relative w-96 h-96 border border-white/5 rounded-full flex items-center justify-center">
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 w-full h-px bg-white" />
            <div className="absolute left-1/2 h-full w-px bg-white" />
          </div>

          {/* Charges */}
          {charges.map(c => (
            <motion.div
              key={c.id}
              layout
              style={{ 
                left: `calc(50% + ${c.x * 200}px)`, 
                top: `calc(50% - ${c.y * 200}px)`,
                x: '-50%',
                y: '-50%'
              }}
              className={cn(
                "absolute w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-2xl z-20 border-2",
                c.q > 0 ? "bg-rose-500/20 border-rose-500 text-rose-500" : "bg-blue-500/20 border-blue-500 text-blue-500",
                c.id === 2 && "ring-4 ring-gold/30"
              )}
            >
              <span className="text-[10px] font-black">{c.q > 0 ? '+' : '-'}{Math.abs(c.q)}μC</span>
              <span className="text-[8px] font-bold opacity-50">Q{c.id}</span>
              
              {/* Force Vector on Q2 */}
              {c.id === 2 && netForceOn2.mag > 0.1 && (
                <div 
                  className="absolute w-1 bg-gold origin-top"
                  style={{ 
                    height: Math.min(100, netForceOn2.mag / 5),
                    transform: `rotate(${Math.atan2(netForceOn2.fx, -netForceOn2.fy)}rad)`,
                    top: '50%'
                  }}
                >
                  <div className="absolute bottom-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gold" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Distance Label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Scale: 1m = 200px | Distance d = {dist}m
          </div>
        </div>
      </div>

      {/* Controls & Calculations */}
      <div className="w-full lg:w-[450px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gold uppercase tracking-widest">Setup</h3>
            <select 
              value={config} 
              onChange={(e) => setConfig(e.target.value as ConfigType)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-gold/50"
            >
              <option value="collinear-2">2 Charges (Collinear)</option>
              <option value="collinear-3">3 Charges (Collinear)</option>
              <option value="right-angle">Right Angle (L)</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Distance d (m)</label>
                <span className="text-xs font-black text-white">{dist}m</span>
              </div>
              <input type="range" min="0.1" max="1.0" step="0.05" value={dist} onChange={(e) => setDist(Number(e.target.value))} className="w-full accent-gold" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q1 (μC)</label>
                <input type="number" value={q1} onChange={(e) => setQ1(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q2 (μC)</label>
                <input type="number" value={q2} onChange={(e) => setQ2(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white" />
              </div>
              {(config === 'collinear-3' || config === 'right-angle' || config === 'square') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q3 (μC)</label>
                  <input type="number" value={q3} onChange={(e) => setQ3(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white" />
                </div>
              )}
              {config === 'square' && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Q4 (μC)</label>
                  <input type="number" value={q4} onChange={(e) => setQ4(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Calculator size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Net Force on Q2</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gold/10 border border-gold/20 text-center">
              <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">Magnitude</div>
              <div className="text-3xl font-black text-white">{netForceOn2.mag.toFixed(2)} <span className="text-sm text-slate-500">N</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-slate-500 uppercase mb-1">X-Component</div>
                <div className="text-lg font-black text-white">{netForceOn2.fx.toFixed(2)} N</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Y-Component</div>
                <div className="text-lg font-black text-white">{netForceOn2.fy.toFixed(2)} N</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Physics Note</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              The net force is the vector sum of all individual Coulomb forces acting on Q2. 
              {"$F_{net} = \\sum \\frac{k q_1 q_2}{r^2} \\hat{r}$"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
