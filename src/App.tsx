import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SIMULATIONS, AREAS_OF_STUDY, Simulation } from './types';
import { SimulationCard } from './components/SimulationCard';
import { Sidebar } from './components/Sidebar';
import { Modal } from './components/Modal';
import ReactMarkdown from 'react-markdown';
import { Search, LayoutGrid, ChevronLeft, FlaskConical } from 'lucide-react';

export default function App() {
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'theory' | 'notes' | null>(null);

  const selectedSim = SIMULATIONS.find(s => s.id === selectedSimId);

  const filteredSims = SIMULATIONS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.aos.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackToHub = () => {
    setSelectedSimId(null);
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedSimId ? (
          <motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-8 lg:p-12"
          >
            <div className="max-w-7xl mx-auto">
              <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gold text-midnight">
                      <FlaskConical size={24} />
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gold">VCAA Physics</h2>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter">
                    Simulation <span className="text-gold">Hub</span>
                  </h1>
                  <p className="text-slate-400 mt-4 max-w-xl text-lg">
                    A professional suite of interactive physics simulations aligned with the VCAA Unit 3 & 4 curriculum.
                  </p>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search simulations, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-midnight-light border border-white/10 rounded-2xl py-4 pl-12 pr-6 w-full md:w-80 focus:outline-none focus:border-gold/50 transition-all text-slate-200 placeholder:text-slate-600"
                  />
                </div>
              </header>

              {AREAS_OF_STUDY.map(aos => {
                const aosSims = filteredSims.filter(s => s.aos.includes(aos.id.split('-')[1].toUpperCase()));
                // Note: The above filter is a bit loose, let's just group by Unit for now if AOS filtering is tricky with placeholder data
                return null; // We'll use a simpler grouping for the demo
              })}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSims.map((sim) => (
                  <SimulationCard
                    key={sim.id}
                    simulation={sim}
                    onClick={() => setSelectedSimId(sim.id)}
                  />
                ))}
              </div>

              {filteredSims.length === 0 && (
                <div className="text-center py-20 glass-panel rounded-3xl">
                  <p className="text-slate-500 text-lg italic">No simulations found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex h-screen overflow-hidden"
          >
            <Sidebar
              simulation={selectedSim!}
              onOpenTheory={() => setActiveModal('theory')}
              onOpenNotes={() => setActiveModal('notes')}
            />

            <main className="flex-1 flex flex-col relative bg-black">
              <div className="absolute top-6 left-6 z-10">
                <button
                  onClick={handleBackToHub}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-all text-slate-300 hover:text-white group"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-semibold">Back to Hub</span>
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center p-12">
                <div className="w-full h-full glass-panel rounded-3xl flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/5">
                  <div className="p-6 rounded-full bg-gold/5 text-gold/20 mb-8">
                    <LayoutGrid size={80} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-500 mb-4">Simulation Placeholder</h2>
                  <p className="text-slate-600 max-w-md">
                    The interactive simulation for <span className="text-slate-400 font-semibold">{selectedSim?.name}</span> will be implemented here.
                  </p>
                </div>
              </div>

              <Modal
                isOpen={activeModal === 'theory'}
                onClose={() => setActiveModal(null)}
                title="Physics Theory"
              >
                <div className="markdown-body">
                  <ReactMarkdown>{selectedSim?.theory || ''}</ReactMarkdown>
                </div>
              </Modal>

              <Modal
                isOpen={activeModal === 'notes'}
                onClose={() => setActiveModal(null)}
                title="Teacher's Notes"
              >
                <div className="markdown-body">
                  <ReactMarkdown>{selectedSim?.teacherNotes || ''}</ReactMarkdown>
                </div>
              </Modal>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
