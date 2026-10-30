import React, { useState } from 'react';
import { ChevronLeft, Share, MoreHorizontal, Edit, Search } from 'lucide-react';
import { sound } from '../../utils/audio';
import { NoteItem } from '../../types';

interface NotesAppProps {
  notes: NoteItem[];
  onClose: () => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({ notes, onClose }) => {
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-20 bg-[#f2f2f7] dark:bg-black text-gray-900 dark:text-white flex flex-col overflow-hidden select-none">
      {/* Top Bar */}
      <div className="pt-11 px-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 bg-[#f2f2f7]/90 dark:bg-black/90 backdrop-blur-md shrink-0">
        {selectedNote ? (
          <button
            onClick={() => {
              sound.playTap();
              setSelectedNote(null);
            }}
            className="flex items-center gap-1 text-amber-500 font-medium text-xs hover:opacity-80"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Catatan</span>
          </button>
        ) : (
          <h1 className="text-xl font-bold tracking-tight">Catatan</h1>
        )}

        <div className="flex items-center gap-3 text-amber-500">
          <button onClick={() => sound.playTap()}>
            <Share className="w-4 h-4" />
          </button>
          <button onClick={() => sound.playTap()}>
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedNote ? (
        /* Note Detail View */
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-white dark:bg-[#1c1c1e] text-xs leading-relaxed">
          <p className="text-[11px] text-gray-400 text-center mb-3">{selectedNote.date}</p>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            {selectedNote.title}
          </h2>
          <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-sans">
            {selectedNote.content}
          </div>
        </div>
      ) : (
        /* Note List View */
        <div className="flex-1 overflow-y-auto flex flex-col p-4">
          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-neutral-800 rounded-xl text-xs text-gray-500 mb-3">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Cari"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-200"
            />
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl divide-y divide-gray-100 dark:divide-neutral-800 shadow-sm overflow-hidden">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  sound.playTap();
                  setSelectedNote(note);
                }}
                className="p-3.5 hover:bg-gray-50 dark:hover:bg-neutral-800/60 cursor-pointer transition"
              >
                <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                  <span className="shrink-0">{note.date.split(' ')[0]}</span>
                  <span className="truncate">{note.content.replace(/\n/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-4">
            {notes.length} Catatan tersimpan di iCloud
          </p>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-neutral-800 bg-[#f2f2f7] dark:bg-[#1c1c1e] px-4 py-2.5 flex items-center justify-between text-amber-500 shrink-0">
        <span className="text-[11px] text-gray-400">{notes.length} Catatan</span>
        <button onClick={() => sound.playTap()} className="p-1 hover:opacity-80">
          <Edit className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
