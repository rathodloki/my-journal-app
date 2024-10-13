import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import NoteList from './NoteList';
import EditModal from './EditModal';
import NoteView from './NoteView';
import LockScreen from './LockScreen';
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
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => setIsLocked(true), 60000);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer(); // Initial timer set

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, []);

  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  const colors = ['purple', 'green', 'orange', 'blue', 'yellow'];

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const addNote = useCallback(() => {
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
  }, [getRandomColor]);

  const editNote = useCallback((id) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setEditingNote(noteToEdit);
    }
  }, [notes]);

  const viewNote = useCallback((id) => {
    const noteToView = notes.find(note => note.id === id);
    if (noteToView) {
      setViewingNote(noteToView);
    }
  }, [notes]);

  const saveNote = useCallback((savedNote) => {
    setNotes(prevNotes => {
      if (prevNotes.find(note => note.id === savedNote.id)) {
        return prevNotes.map(note => note.id === savedNote.id ? savedNote : note);
      } else {
        const newNoteWithColor = { ...savedNote, color: getRandomColor() };
        setAnimatingNoteId(newNoteWithColor.id);
        setTimeout(() => setAnimatingNoteId(null), 300);
        return [newNoteWithColor, ...prevNotes];
      }
    });
    setEditingNote(null);
  }, [getRandomColor]);

  const deleteNote = useCallback((id) => {
    setAnimatingNoteId(id);
    setTimeout(() => {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setAnimatingNoteId(null);
    }, 300);
  }, []);

  const toggleStar = useCallback((id) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === id ? { ...note, hasStar: !note.hasStar } : note
    ));
  }, []);

  const filteredNotes = notes.filter(note => {
    if (activeColor && note.color !== activeColor) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(searchLower);
    const contentMatch = note.content.toLowerCase().includes(searchLower);
    const dateMatch = note.date.includes(searchTerm);
    const numberMatch = (note.title + note.content).match(new RegExp(searchTerm, 'i'));
    
    return titleMatch || contentMatch || dateMatch || numberMatch;
  });

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
      {isLocked && <LockScreen onUnlock={handleUnlock} />}
    </div>
  );
};

export default NotesApp;