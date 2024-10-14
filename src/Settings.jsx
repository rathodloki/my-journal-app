import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Upload, Mail } from 'lucide-react';

const Settings = ({ isOpen, onClose, notes, onImport }) => {
  const settingsModalRef = useRef(null);
  const emailModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsModalRef.current && !settingsModalRef.current.contains(event.target)) {
        if (!showEmailModal) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showEmailModal]);

  useEffect(() => {
    const handleEmailModalClickOutside = (event) => {
      if (emailModalRef.current && !emailModalRef.current.contains(event.target)) {
        setShowEmailModal(false);
      }
    };

    if (showEmailModal) {
      document.addEventListener('mousedown', handleEmailModalClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleEmailModalClickOutside);
    };
  }, [showEmailModal]);

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

  const handleEmailExport = (e) => {
    e.preventDefault();
    const notesJson = JSON.stringify(notes, null, 2);
    const emailBody = encodeURIComponent(`Here are your exported notes:\n\n${notesJson}`);
    window.location.href = `mailto:${email}?subject=Exported%20Notes&body=${emailBody}`;
    setShowEmailModal(false);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={settingsModalRef} className="bg-white rounded-lg w-full max-w-md relative overflow-hidden">
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
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Export to Email</span>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-purple-500 hover:text-purple-600 transition-colors focus:outline-none"
            >
              <Mail size={20} />
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
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={emailModalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Export to Email</h3>
            <form onSubmit={handleEmailExport}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;