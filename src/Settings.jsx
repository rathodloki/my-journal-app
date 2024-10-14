import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Upload, Clipboard, ClipboardPaste } from 'lucide-react';

const Settings = ({ isOpen, onClose, notes, onImport }) => {
  const modalRef = useRef(null);
  const pasteModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  const [pasteError, setPasteError] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) &&
          (!pasteModalRef.current || !pasteModalRef.current.contains(event.target))) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
          setPasteError('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCopyToClipboard = async () => {
    const notesJson = JSON.stringify(notes, null, 2);
    try {
      await navigator.clipboard.writeText(notesJson);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setPasteError('Failed to copy to clipboard. Please try again.');
    }
  };

  const handlePasteClick = (e) => {
    e.stopPropagation();
    setShowPasteModal(true);
    setPasteError('');
  };

  const handlePasteContentChange = (e) => {
    setPasteContent(e.target.value);
    setPasteError('');
  };

  const handlePasteSubmit = async (e) => {
    e.stopPropagation();
    setIsPasting(true);
    setPasteError('');
    try {
      const importedNotes = JSON.parse(pasteContent);
      // Introduce a slight delay to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 500));
      await onImport(importedNotes);
      setPasteSuccess(true);
      setTimeout(() => {
        setPasteSuccess(false);
        setShowPasteModal(false);
        setPasteContent('');
      }, 2000);
    } catch (error) {
      console.error('Error parsing pasted content:', error);
      setPasteError('Invalid JSON format.');
    } finally {
      setIsPasting(false);
    }
  };

  const handlePasteModalClose = (e) => {
    e.stopPropagation();
    if (!isPasting) {
      setShowPasteModal(false);
      setPasteError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md relative overflow-hidden">
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
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Copy to Clipboard</span>
            <button
              onClick={handleCopyToClipboard}
              className="text-purple-500 hover:text-purple-600 transition-colors focus:outline-none"
            >
              <Clipboard size={20} />
            </button>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Paste</span>
            <button
              onClick={handlePasteClick}
              className="text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
            >
              <ClipboardPaste size={20} />
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-500 text-sm">Successfully copied to clipboard!</p>
          )}
          {pasteSuccess && (
            <p className="text-green-500 text-sm">Successfully imported pasted content!</p>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>
      {showPasteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handlePasteModalClose}
        >
          <div 
            ref={pasteModalRef}
            className="bg-white rounded-lg w-full max-w-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Paste JSON Content</h3>
            <textarea
              className="w-full h-40 p-2 border rounded mb-2"
              value={pasteContent}
              onChange={handlePasteContentChange}
              placeholder="Paste your JSON content here..."
              disabled={isPasting}
            />
            {pasteError && (
              <p className="text-red-500 text-sm mb-2">{pasteError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                onClick={handlePasteModalClose}
                disabled={isPasting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                onClick={handlePasteSubmit}
                disabled={isPasting}
              >
                {isPasting ? 'Pasting...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;