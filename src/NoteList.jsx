import React from 'react';
import NoteCard from './NoteCard';

const NoteList = ({ notes, onEdit, onDelete, onToggleStar, onView, animatingNoteId }) => {
  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl md:text-2xl text-gray-500 font-semibold">No journal yet</p>
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