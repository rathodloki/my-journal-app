import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Upload, Clipboard, File } from 'lucide-react';

const Toast = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-sm px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ease-in-out">
      {message}
    </div>
  );
};

const Settings = ({ isOpen, onClose, notes, onImport }) => {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  const showNotification = (message) => {
    setToast({ id: Date.now(), message });
  };

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
    showNotification('Notes exported successfully!');
  };

  const handleImportClick = () => {
    setShowImportOptions(true);
  };

  const handleFileUpload = () => {
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
          showNotification('Notes imported successfully!');
        } catch (error) {
          console.error('Error parsing imported file:', error);
          showNotification('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        showNotification('Clipboard is empty');
        return;
      }
      const importedNotes = JSON.parse(clipboardText);
      onImport(importedNotes);
      showNotification('Pasted');
    } catch (error) {
      console.error('Error parsing clipboard content:', error);
      showNotification('Invalid data format in clipboard. Please copy a valid JSON.');
    }
  };

  const handleCopyToClipboard = async () => {
    const notesJson = JSON.stringify(notes, null, 2);
    try {
      await navigator.clipboard.writeText(notesJson);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed to copy');
      showNotification('Failed to copy notes to clipboard');
      setTimeout(() => setCopyStatus(''), 2000);
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
            <span className="text-gray-700">Export All Notecards</span>
            <button
              onClick={handleExport}
              className="text-blue-500 hover:text-blue-600 transition-colors focus:outline-none"
            >
              <Download size={20} />
            </button>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Import Notecards</span>
            <button
              onClick={handleImportClick}
              className="text-green-500 hover:text-green-600 transition-colors focus:outline-none"
            >
              <Upload size={20} />
            </button>
          </div>
          {showImportOptions && (
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handlePasteFromClipboard}
                className="text-purple-500 hover:text-purple-600 transition-colors focus:outline-none"
              >
                <Clipboard size={20} />
              </button>
              <button
                onClick={handleFileUpload}
                className="text-orange-500 hover:text-orange-600 transition-colors focus:outline-none"
              >
                <File size={20} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Copy All to Clipboard</span>
            <button
              onClick={handleCopyToClipboard}
              className="text-purple-500 hover:text-purple-600 transition-colors focus:outline-none relative"
            >
              <Clipboard size={20} />
              {copyStatus && (
                <span className="absolute -top-8 -left-10 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                  {copyStatus}
                </span>
              )}
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
      {toast && (
        <Toast 
          key={toast.id}
          message={toast.message} 
          onDismiss={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Settings;