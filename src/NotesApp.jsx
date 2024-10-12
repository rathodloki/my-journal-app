import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import NoteList from './NoteList';
import EditModal from './EditModal';
import NoteView from './NoteView';
import { Menu, Plus } from 'lucide-react';

const NotesApp = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [activeColor, setActiveColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [animatingNoteId, setAnimatingNoteId] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSyAkkvxzoasArg5bV1z3nA8m_COQhOPgdjY');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const colors = ['purple', 'green', 'orange'];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: '',
      content: '',
      color: getRandomColor(),
      date: new Date().toLocaleDateString(),
      hasStar: false
    };
    setEditingNote(newNote);
    setIsSidebarOpen(false);
  };

  const editNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setEditingNote(noteToEdit);
    }
  };

  const viewNote = (id) => {
    const noteToView = notes.find(note => note.id === id);
    if (noteToView) {
      setViewingNote(noteToView);
    }
  };

  const saveNote = (savedNote) => {
    if (notes.find(note => note.id === savedNote.id)) {
      setNotes(notes.map(note => note.id === savedNote.id ? savedNote : note));
    } else {
      const newNoteWithColor = { ...savedNote, color: getRandomColor() };
      setNotes([newNoteWithColor, ...notes]);
      setAnimatingNoteId(newNoteWithColor.id);
      setTimeout(() => setAnimatingNoteId(null), 300);
    }
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    setAnimatingNoteId(id);
    setTimeout(() => {
      setNotes(notes.filter(note => note.id !== id));
      setAnimatingNoteId(null);
    }, 300);
  };

  const toggleStar = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, hasStar: !note.hasStar } : note
    ));
  };

  const filteredNotes = notes.filter(note => 
    (activeColor ? note.color === activeColor : true) &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Docket</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
          <Menu size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-hidden flex">
        <Sidebar 
          addNote={addNote} 
          activeColor={activeColor} 
          setActiveColor={setActiveColor}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto p-4">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          <NoteList 
            notes={filteredNotes} 
            onEdit={editNote}
            onDelete={deleteNote} 
            onToggleStar={toggleStar}
            onView={viewNote}
            animatingNoteId={animatingNoteId}
          />
        </main>
      </div>
      <button
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-lg"
        onClick={addNote}
      >
        <Plus size={24} />
      </button>
      {editingNote && (
        <EditModal 
          note={editingNote} 
          onSave={saveNote} 
          onClose={() => setEditingNote(null)} 
          geminiApiKey={geminiApiKey}
        />
      )}
      {viewingNote && (
        <NoteView
          note={viewingNote}
          onClose={() => setViewingNote(null)}
        />
      )}
    </div>
  );
};

export default NotesApp;