import React, { useState, useEffect } from 'react';
import { processNoteWithGeminiAI } from './services/geminiAIService';
import { X } from 'lucide-react';

const EditModal = ({ note, onSave, onClose, geminiApiKey }) => {
  const [editedNote, setEditedNote] = useState(note);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = async () => {
    if (editedNote.title.trim() === '' && editedNote.content.trim() === '') {
      onClose();
      return;
    }

    if (!geminiApiKey) {
      setError('Gemini API Key is missing. Please enter it in the main screen.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const enhancedContentText = await processNoteWithGeminiAI(geminiApiKey, editedNote.content);
      
      let enhancedContent;
      try {
        enhancedContent = JSON.parse(enhancedContentText);
      } catch (jsonError) {
        console.error('Error parsing Gemini response as JSON:', jsonError);
        enhancedContent = {
          title: editedNote.title,
          description: editedNote.content
        };
      }
      
      const enhancedNote = {
        ...editedNote,
        title: enhancedContent.title || editedNote.title,
        content: enhancedContent.description || editedNote.content,
        date: new Date().toLocaleDateString()
      };
      onSave(enhancedNote);
    } catch (error) {
      console.error('Error processing note with Gemini AI:', error);
      setError('Failed to enhance note. Saving original content.');
      setTimeout(() => {
        onSave({...editedNote, date: new Date().toLocaleDateString()});
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editedNote.title ? 'Edit Note' : 'New Note'}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        <input
          type="text"
          value={editedNote.title}
          onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
          placeholder="Enter title"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={editedNote.content}
          onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
          placeholder="Enter content"
          className="w-full p-2 mb-4 border rounded h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;