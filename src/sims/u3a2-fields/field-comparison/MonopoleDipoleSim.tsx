import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Magnet, Zap, Info, ArrowRight } from 'lucide-react';
import { cn } from '../../../utils';

type FieldType = 'gravitational' | 'electric' | 'magnetic';

export default function MonopoleDipoleSim() {
  const [fieldType, setFieldType] = useState<FieldType>('gravitational');

  const renderFieldLines = () => {
    const lines = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      lines.push(angle);
    }

    switch (fieldType) {
      case 'gravitational':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Monopole Source */}
            <div className="relative z-10 w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Globe className="text-blue-400" size={32} />
            </div>
            {/* Inward Field Lines */}
            {lines.map((angle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute w-40 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
                style={{ transform: `rotate(${angle}rad) translateX(-60px)` }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-8 border-r-blue-400/60" />
              </motion.div>
            ))}
          </div>
        );
      case 'electric':
        return (
          <div className="relative w-full h-full flex items-center justify-center gap-24">
            {/* Monopole (Positive) */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="relative z-10 w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center font-black text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                +
              </div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Monopole</span>
              {lines.map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-24 h-px bg-rose-400/20"
                  style={{ transform: `rotate(${angle}rad) translateX(45px)` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-rose-400/60" />
                </div>
              ))}
            </div>
            {/* Dipole */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center font-black text-rose-400">+</div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center font-black text-blue-400">-</div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dipole</span>
              <svg className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none opacity-30">
                <path d="M 60 96 Q 96 40 132 96" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 60 96 Q 96 152 132 96" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 60 96 L 132 96" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        );
      case 'magnetic':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Dipole Only */}
            <div className="relative flex flex-col items-center gap-8">
              <div className="w-48 h-12 flex rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <div className="flex-1 bg-rose-600 flex items-center justify-center text-white font-black">N</div>
                <div className="flex-1 bg-slate-700 flex items-center justify-center text-white font-black">S</div>
              </div>
              <span className="text-[10px] font-black text-gold uppercase tracking-widest">Dipole Only (No Monopoles)</span>
              
              {/* Field Lines */}
              <svg className="absolute inset-0 w-[400px] h-[300px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none opacity-40">
                {[1, 2, 3].map(i => (
                  <ellipse 
                    key={i} 
                    cx="200" cy="150" rx={100 + i*30} ry={40 + i*20} 
                    fill="none" stroke="gold" strokeWidth="1" strokeDasharray="5 5"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 lg:flex-row overflow-y-auto custom-scrollbar">
      {/* Visual Area */}
      <div className="flex-1 glass-panel rounded-3xl relative overflow-hidden bg-slate-950/50 border-white/5 flex items-center justify-center">
        <div className="absolute top-8 left-8 flex items-center gap-2 text-gold">
          <Zap size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Source Properties</span>
        </div>
        {renderFieldLines()}
      </div>

      {/* Controls & Theory */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="glass-panel rounded-3xl p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-black text-gold uppercase tracking-widest">Select Field Type</h3>
          <div className="grid grid-cols-1 gap-2">
            {(['gravitational', 'electric', 'magnetic'] as FieldType[]).map(t => (
              <button
                key={t}
                onClick={() => setFieldType(t)}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex items-center gap-4 text-left",
                  fieldType === t 
                    ? "bg-gold/10 border-gold text-gold" 
                    : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                )}
              >
                {t === 'gravitational' && <Globe size={20} />}
                {t === 'electric' && <Zap size={20} />}
                {t === 'magnetic' && <Magnet size={20} />}
                <span className="text-xs font-black uppercase tracking-widest">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/5 flex-1 space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Info size={18} />
            <h3 className="text-sm font-black uppercase tracking-widest">Physics Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Fundamental Property</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {fieldType === 'gravitational' && "Gravitational fields are generated by mass. Since mass is always positive, gravity is always attractive and exists only as a monopole field."}
                {fieldType === 'electric' && "Electric fields are generated by charge. Charges can exist individually (monopoles) or in pairs (dipoles). Fields can be attractive or repulsive."}
                {fieldType === 'magnetic' && "Magnetic fields are generated by moving charges or intrinsic spin. Magnetic poles always exist in pairs (dipoles); no magnetic monopole has ever been observed."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10">
              <div className="text-[10px] font-black text-gold uppercase mb-2">VCE Key Concept</div>
              <p className="text-[10px] text-slate-400 italic">
                {fieldType === 'gravitational' && "Gravity is always attractive. Field lines always point towards the mass."}
                {fieldType === 'electric' && "Field lines originate from positive charges and terminate on negative charges."}
                {fieldType === 'magnetic' && "Field lines form continuous loops, exiting the North pole and entering the South pole."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
