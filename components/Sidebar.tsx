import React from 'react';
import { AreaOfStudy } from '../types';
import { 
  Zap, 
  LayoutGrid, 
  ExternalLink, 
  Info, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onFilter: (aos: AreaOfStudy | 'all') => void;
  onNavigate: (page: 'home' | 'about' | 'legal') => void;
  activeFilter: AreaOfStudy | 'all';
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilter, onNavigate, activeFilter, activePage }) => {
  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full sticky top-0 overflow-y-auto custom-scrollbar">
      <div className="p-8 border-b border-zinc-900">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { onNavigate('home'); onFilter('all'); }}
        >
          <div className="bg-amber-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap size={20} className="text-black fill-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">VCE Physics</h1>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Mr. Eric Chui Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-grow p-4 py-6 space-y-8">
        <div>
          <h4 className="px-4 text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-4">Areas of Study</h4>
          <div className="space-y-1">
            <button 
              onClick={() => { onNavigate('home'); onFilter('all'); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all ${activeFilter === 'all' && activePage === 'home' ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <span className="flex items-center gap-3"><LayoutGrid size={16} /> All Simulations</span>
            </button>
            {Object.values(AreaOfStudy).map((aos) => (
              <button 
                key={aos}
                onClick={() => { onNavigate('home'); onFilter(aos); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl transition-all ${activeFilter === aos && activePage === 'home' ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                <span className="truncate">{aos}</span>
                <ChevronRight size={14} className={activeFilter === aos ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="px-4 text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-4">Support</h4>
          <div className="space-y-1">
            <button 
              onClick={() => onNavigate('about')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all ${activePage === 'about' ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <Info size={16} /> Educator's Note
            </button>
            <button 
              onClick={() => onNavigate('legal')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-all ${activePage === 'legal' ? 'bg-amber-500/10 text-amber-500 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
            >
              <ShieldCheck size={16} /> Licensing
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 bg-zinc-900/20 border-t border-zinc-900">
        <div className="bg-zinc-900 rounded-xl p-3">
          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">VCAA Quick Links</p>
          <div className="space-y-1">
            <a href="https://www.vcaa.vic.edu.au/Documents/exams/physics/physics-formula-sheet.pdf" target="_blank" className="flex items-center justify-between text-[11px] text-zinc-400 hover:text-amber-500">
              Formula Sheet <ExternalLink size={10} />
            </a>
            <a href="https://www.vcaa.vic.edu.au/curriculum/vce/vce-study-designs/physics/Pages/Index.aspx" target="_blank" className="flex items-center justify-between text-[11px] text-zinc-400 hover:text-amber-500">
              Study Design <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;