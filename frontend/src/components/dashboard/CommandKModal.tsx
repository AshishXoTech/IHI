'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_COMMANDS = [
  { id: '1', title: 'Deploy AI Track Judges', category: 'Action', badge: 'AI Engine' },
  { id: '2', title: 'Export Submissions CSV', category: 'Data', badge: 'Export' },
  { id: '3', title: 'Lock Rubrics & Criteria', category: 'Judging', badge: 'Gate' },
  { id: '4', title: 'Search Hacker: Alex Chen', category: 'Hackers', badge: 'Participant' },
  { id: '5', title: 'Team Quantum (4/4 members)', category: 'Teams', badge: 'Team' },
  { id: '6', title: 'Stanford TreeHacks 2025 Settings', category: 'System', badge: 'Config' },
];

export function CommandKModal({ isOpen, onClose }: CommandKModalProps) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ⌘K / Ctrl+K & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCommands = QUICK_COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A0A0A]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#E6E5E0] bg-white shadow-2xl z-10"
          >
            {/* Gold Accent Top Bar */}
            <div className="h-1 bg-gradient-to-r from-[#C6A24A] via-[#E8D9A8] to-[#C6A24A]" />

            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-[#E6E5E0] px-4 py-3.5">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-[#C6A24A]">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search hackers, teams, rubrics..."
                className="flex-1 bg-transparent text-sm font-sans text-[#0A0A0A] placeholder:text-[#706F6B] focus:outline-none"
              />
              <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold text-[#706F6B] bg-[#FAF9F5] border border-[#E6E5E0] rounded">
                ESC
              </kbd>
            </div>

            {/* Command Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={onClose}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F3E3] text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#C6A24A] group-hover:scale-125 transition-transform" />
                      <span className="text-xs font-serif font-semibold text-[#0A0A0A] group-hover:text-[#A07F32]">
                        {cmd.title}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] uppercase font-bold text-[#706F6B] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6E5E0]">
                      {cmd.badge}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-mono text-[#706F6B]">
                  No matching results found for "{query}"
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div className="border-t border-[#E6E5E0] bg-[#FAF9F5] px-4 py-2.5 flex items-center justify-between font-mono text-[10px] text-[#706F6B]">
              <span>Navigate with ↑ ↓ keys</span>
              <span>Press <strong className="text-[#0A0A0A]">↵ Enter</strong> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}