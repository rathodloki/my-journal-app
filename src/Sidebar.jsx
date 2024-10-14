import React from 'react';
import { Plus, X, Star, Settings } from 'lucide-react';

const colorClasses = {
  orange: 'bg-orange-200 hover:bg-orange-300 hover:shadow-orange-300',
  yellow: 'bg-yellow-200 hover:bg-yellow-300 hover:shadow-yellow-300',
  purple: 'bg-purple-200 hover:bg-purple-300 hover:shadow-purple-300',
  green: 'bg-green-200 hover:bg-green-300 hover:shadow-green-300',
  blue: 'bg-blue-200 hover:bg-blue-300 hover:shadow-blue-300',
};

const Sidebar = ({ addNote, activeColor, setActiveColor, isOpen, onClose, showFavorites, setShowFavorites, onOpenSettings }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onClose}></div>
    )}
    <aside className={`fixed md:static top-0 left-0 z-50 w-20 bg-white shadow-md flex flex-col items-center py-6 h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="md:hidden absolute top-4 right-4">
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <h1 className="text-xl font-semibold mb-6 writing-vertical-rl transform rotate-180"></h1>
      <button 
        className="bg-black text-white rounded-full p-2 mb-6 transition-all duration-300 hover:scale-110 hover:bg-gray-800" 
        onClick={() => {
          addNote();
          onClose();
        }}
      >
        <Plus size={24} />
      </button>
      <div className="flex flex-col space-y-4 flex-grow">
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out 
          ${showFavorites ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'} 
          hover:scale-105 cursor-pointer shadow-sm hover:shadow-md`}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Star size={16} />
        </button>
        {Object.entries(colorClasses).map(([color, className]) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full ${className} transition-all duration-300 ease-in-out 
            ${activeColor === color ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'}
            cursor-pointer hover:brightness-110 shadow-sm hover:shadow-md`}
            onClick={() => setActiveColor(activeColor === color ? null : color)}
          ></button>
        ))}
      </div>
      <button
        className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md mt-auto"
        onClick={onOpenSettings}
      >
        <Settings size={16} />
      </button>
    </aside>
  </>
);

export default Sidebar;