import React from 'react';
import NoteCard from './NoteCard';

const NoteList = ({ notes, onEdit, onDelete, onToggleStar, onView, animatingNoteId }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <img 
          src="./assets/image/empty.png" 
          alt="No notes" 
          className="w-72 h-72 mb-6"
        />
        <p className="text-4xl text-gray-400 font-semibold">No journal yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center sm:justify-items-stretch">
      {notes.map((note) => (
        <div key={note.id} className="w-full max-w-sm sm:max-w-none">
          <NoteCard
            {...note}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStar={onToggleStar}
            onView={onView}
            isAnimating={animatingNoteId === note.id}
          />
        </div>
      ))}
    </div>
  );
};

export default NoteList;