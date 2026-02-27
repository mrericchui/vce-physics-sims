import React from 'react';

interface VcaaSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const VcaaSlider: React.FC<VcaaSliderProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  unit = "", 
  onChange 
}) => {
  return (
    <div className="space-y-2 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
        <span className="text-sm font-mono text-amber-500 font-bold">{value}{unit}</span>
      </div>
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
    </div>
  );
};

export default VcaaSlider;