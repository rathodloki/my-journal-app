import React, { useRef } from 'react';
import { X, Download, Upload } from 'lucide-react';

const Settings = ({ isOpen, onClose, notes, onImport }) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const notesJson = JSON.stringify(notes, null, 2);
    const blob = new Blob([notesJson], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'my_journals.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result);
          onImport(importedNotes);
        } catch (error) {
          console.error('Error parsing imported file:', error);
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-4 py-2 space-y-2">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Export</span>
            <button
              onClick={handleExport}
              className="text-blue-500 hover:text-blue-600 transition-colors focus:outline-none"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Import</span>
            <button
              onClick={handleImportClick}
              className="text-green-500 hover:text-green-600 transition-colors focus:outline-none"
            >
              <Upload size={20} />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;