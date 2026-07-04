import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, AlertCircle, Play, Pause, Volume2, RotateCcw } from 'lucide-react';
import { generateStory } from '../../services/gemini/geminiClient';
import type { StoryContent } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attractionName: string;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  attractionName
}) => {
  const [story, setStory] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lore' | 'details' | 'facts'>('lore');
  
  // Audio Narrator states (simulated)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    const fetchStory = async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(null);
      setStory(null);
      setIsPlaying(false);
      setAudioProgress(0);

      try {
        const data = await generateStory(attractionName);
        setStory(data);
      } catch (err) {
        setError('Failed to conjure the story for this place. The local spirits are silent right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [isOpen, attractionName]);

  // Handle simulated audio narration timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleResetAudio = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chronicles of ${attractionName}`}
      size="lg"
    >
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-16 h-16 flex items-center justify-center mb-4">
            {/* Spinning decorative elements */}
            <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <BookOpen size={24} className="text-primary animate-pulse" />
          </div>
          <span className="text-sm font-semibold text-slate-800 animate-pulse">Consulting ancient scripts...</span>
          <span className="text-xs text-slate-400 mt-1">AI is composing legends & histories</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle size={40} className="text-rose-500 mb-3" />
          <h4 className="font-bold text-slate-800 mb-1">Spirit Connection Interrupted</h4>
          <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">{error}</p>
          <Button variant="secondary" onClick={() => setLoading(true)} size="sm">
            Try Again
          </Button>
        </div>
      )}

      {story && (
        <div className="flex flex-col gap-6">
          {/* Simulated Audio Narrator Bar */}
          <div className="glass-effect rounded-2xl p-4 border border-emerald-100/60 bg-emerald-50/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 focus:outline-none"
                aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  Listen to Local Legend <Volume2 size={12} className="text-primary" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {isPlaying ? 'Narrating story...' : 'AI Audio Companion'}
                </span>
              </div>
            </div>

            {/* Simulated progress slider */}
            <div className="flex-1 hidden sm:flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold">0:00</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">3:25</span>
            </div>

            <button
              onClick={handleResetAudio}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              title="Rewind"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 pb-px gap-2">
            {[
              { id: 'lore', label: 'Lore & Folklore' },
              { id: 'details', label: 'History & Arch' },
              { id: 'facts', label: 'Facts & Tips' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-300 focus:outline-none ${
                    isActive
                      ? 'border-primary text-primary-dark font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div className="min-h-[220px]">
            {activeTab === 'lore' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5 text-slate-600 leading-relaxed text-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Myths & Legends</h4>
                  <p className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl italic font-serif">
                    "{story.legends}"
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Local Folklore</h4>
                  <p>{story.folklore}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5 text-slate-600 leading-relaxed text-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Historical Origins</h4>
                  <p>{story.history}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Architectural Marvel</h4>
                  <p>{story.architecture}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'facts' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    Interesting Facts <Sparkles size={12} className="text-primary" />
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {story.interestingFacts.map((fact, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-medium text-slate-600">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Local Companion Tips
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {story.travelTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-medium text-slate-600">
                        <span className="text-emerald-500 font-bold">✔</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
export default StoryModal;
