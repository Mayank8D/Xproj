import React, { useState, useEffect } from 'react';

function App() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('😊');

  useEffect(() => {
    const saved = localStorage.getItem('journal-entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        setEntries([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!text.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      text: text.trim(),
      mood: mood,
      date: new Date().toLocaleDateString()
    };
    
    setEntries([newEntry, ...entries]);
    setText('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Journal</h1>
          <p className="text-gray-600">Write your thoughts</p>
        </div>

        {/* Add Entry */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="flex gap-2">
              {['😊', '😢', '😡', '😴', '🤔'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMood(emoji)}
                  className={`text-2xl p-2 rounded ${
                    mood === emoji ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={addEntry}
            className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Entry
          </button>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No entries yet. Start writing!</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.mood}</span>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700">{entry.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Simple Stats */}
        {entries.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Total entries: <span className="font-semibold">{entries.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;