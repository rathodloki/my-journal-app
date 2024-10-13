import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'cagatay') {
      onUnlock();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-90 backdrop-blur-lg">
      <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-sm mx-auto shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <Lock size={48} className="text-gray-700 mb-4" />
          <h2 className="text-2xl font-semibold text-center">App Locked</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;