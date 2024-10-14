import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const NoteView = ({ note, onClose }) => {
  const noteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        ref={noteRef}
        className={`bg-${note.color}-200 rounded-lg p-6 w-full max-w-2xl relative`}
      >
        <button 
          className="absolute top-2 right-2 transition-transform hover:scale-110" 
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">{note.title}</h2>
        <p className="text-lg mb-4 whitespace-pre-wrap">{note.content}</p>
        {note.date && <p className="text-sm text-gray-600">{note.date}</p>}
      </div>
    </div>
  );
};

export default NoteView;