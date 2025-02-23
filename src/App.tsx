import React, { useState, useEffect } from 'react';
import { Plus, Search, Pin, Trash2, Edit2, X, Github, Globe, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isPinned ? -1 : 1;
  });

  const handleAddNote = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleSaveNote = (noteData: { title: string; content: string }) => {
    if (currentNote) {
      setNotes(notes.map(note => 
        note.id === currentNote.id 
          ? { ...note, ...noteData, createdAt: new Date().toISOString() }
          : note
      ));
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        ...noteData,
        createdAt: new Date().toISOString(),
        isPinned: false
      };
      setNotes([newNote, ...notes]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-nebula">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col p-6">
          <header className="mb-8">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
              Nebula Notes
            </h1>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-700/80 transition-colors flex items-center gap-2 backdrop-blur-xl border border-purple-500/30"
              >
                <Plus size={20} />
                Add Note
              </button>
            </div>
          </header>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {sortedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:border-purple-500/30 note-card"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          note.isPinned ? 'bg-purple-500/80' : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{note.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{note.content}</p>
                    <time className="text-sm text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <footer className="mt-12 py-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">© Nitin Mahala</p>
              <div className="flex gap-6">
                <a
                  href="https://github.com/nitinmahala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://nitinmahala.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/nitinmahala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg rounded-xl bg-gray-900/90 backdrop-blur-xl border border-white/10 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">
                  {currentNote ? 'Edit Note' : 'New Note'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <NoteForm
                initialNote={currentNote}
                onSave={handleSaveNote}
                onCancel={() => setIsModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NoteFormProps {
  initialNote: Note | null;
  onSave: (note: { title: string; content: string }) => void;
  onCancel: () => void;
}

function NoteForm({ initialNote, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>
      <div>
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-gray-400 resize-none"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-700/80 transition-colors backdrop-blur-xl border border-purple-500/30"
        >
          Save Note
        </button>
      </div>
    </form>
  );
}

export default App;