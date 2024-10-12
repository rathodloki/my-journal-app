import React from 'react';
import { Edit, Star, X } from 'lucide-react';

const colorClasses = {
  orange: 'bg-orange-200 hover:bg-orange-300 hover:shadow-orange-300',
  yellow: 'bg-yellow-200 hover:bg-yellow-300 hover:shadow-yellow-300',
  purple: 'bg-purple-200 hover:bg-purple-300 hover:shadow-purple-300',
  green: 'bg-green-200 hover:bg-green-300 hover:shadow-green-300',
  blue: 'bg-blue-200 hover:bg-blue-300 hover:shadow-blue-300',
};

const NoteCard = ({ id, title, content, date, color, hasStar, onEdit, onDelete, onToggleStar, onView, isAnimating }) => {
  const colorClass = colorClasses[color] || colorClasses.yellow;

  return (
    <div 
      className={`${colorClass} p-4 rounded-lg shadow-sm relative 
      transition-all duration-300 ease-in-out 
      hover:-translate-y-1 cursor-pointer`}
      onClick={() => onView(id)}
    >
      <h3 className="font-semibold mb-2 text-base md:text-lg">{title}</h3>
      <p className="text-xs md:text-sm mb-2 line-clamp-3">{content}</p>
      {date && <p className="text-xs text-gray-600 mb-2">{date}</p>}
      <div className="flex justify-end space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }} 
          className="transition-transform hover:scale-110"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(id);
          }} 
          className="transition-transform hover:scale-110"
        >
          <Star size={16} fill={hasStar ? "black" : "none"} />
        </button>
      </div>
      <button 
        className="absolute top-2 right-2 transition-transform hover:scale-110" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default NoteCard;