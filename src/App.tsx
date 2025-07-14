import React, { useState, useEffect } from 'react';

type Entry = {
  id: number;
  text: string;
  mood: string;
  date: string;
  habits: string[];
};

type Habit = {
  id: number;
  name: string;
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('😊');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<number[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [completedHabits, setCompletedHabits] = useState<{[key:number]: string[]}>({});
  const [editId, setEditId] = useState<number|null>(null);
  const [editText, setEditText] = useState('');
  const [editMood, setEditMood] = useState('😊');
  const [editHabits, setEditHabits] = useState<number[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('tracker-entries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        setEntries([]);
      }
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
    const savedHabits = localStorage.getItem('tracker-habits');
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        setHabits([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tracker-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tracker-habits', JSON.stringify(habits));
  }, [habits]);

  const addEntry = () => {
    if (!text.trim()) return;
    
    const newEntry: Entry = {
      id: Date.now(),
      text: text.trim(),
      mood: mood,
      date: new Date().toLocaleDateString(),
      habits: selectedHabits.map(id => habits.find(h => h.id === id)?.name || '')
    };
    
    setEntries([newEntry, ...entries]);
    setText('');
    setSelectedHabits([]);
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabit.trim() }]);
    setNewHabit('');
  };

  const toggleHabit = (id: number) => {
    setSelectedHabits(selectedHabits.includes(id)
      ? selectedHabits.filter(hid => hid !== id)
      : [...selectedHabits, id]);
  };

  const getToday = () => new Date().toLocaleDateString();

  const getStreak = (habitId: number) => {
    const dates = completedHabits[habitId] || [];
    let streak = 0;
    let day = new Date();
    for (let i = 0; i < dates.length; i++) {
      if (dates.includes(day.toLocaleDateString())) {
        streak++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const markHabitComplete = (habitId: number) => {
    setCompletedHabits(prev => {
      const today = getToday();
      const dates = prev[habitId] || [];
      if (!dates.includes(today)) {
        return { ...prev, [habitId]: [...dates, today] };
      }
      return prev;
    });
  };

  const filterByMood = (mood: string) => {
    setSearch('');
    setDateFilter('');
    setEntries(entries.filter(e => e.mood === mood));
  };

  const startEdit = (entry: Entry) => {
    setEditId(entry.id);
    setEditText(entry.text);
    setEditMood(entry.mood);
    setEditHabits(habits.filter(h => entry.habits.includes(h.name)).map(h => h.id));
  };

  const saveEdit = () => {
    setEntries(entries.map(e =>
      e.id === editId ? { ...e, text: editText, mood: editMood, habits: editHabits.map(id => habits.find(h => h.id === id)?.name || '') } : e
    ));
    setEditId(null);
    setEditText('');
    setEditMood('😊');
    setEditHabits([]);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.text.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter ? entry.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  const themeClasses = {
    light: {
      container: 'min-h-screen bg-neutral-100 text-neutral-900 p-4',
      card: 'bg-white border border-neutral-200 rounded-xl shadow p-6 mb-6',
      header: 'text-3xl font-bold tracking-tight mb-2 text-neutral-800',
      sub: 'text-neutral-500',
      button: 'ml-4 bg-neutral-200 text-neutral-800 px-3 py-2 rounded-xl hover:bg-neutral-300 border border-neutral-300',
      moodActive: 'bg-neutral-800 text-white',
      moodInactive: 'hover:bg-neutral-200',
      textarea: 'w-full p-3 border border-neutral-300 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-neutral-800 bg-neutral-50 text-neutral-900',
      addBtn: 'mt-3 w-full bg-neutral-800 text-white py-2 px-4 rounded-xl hover:bg-neutral-900 transition-colors',
      input: 'flex-1 p-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900',
      date: 'p-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900',
      clearBtn: 'p-2 rounded-xl bg-neutral-200 text-neutral-800 border border-neutral-300',
      entryCard: 'bg-white border border-neutral-200 rounded-xl shadow p-4',
      entryDate: 'text-sm text-neutral-500',
      entryText: 'text-neutral-900',
      deleteBtn: 'text-red-400 hover:text-red-600 text-sm',
      stats: 'text-neutral-500',
      habitBtn: 'px-3 py-1 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-800 mr-2',
      habitActive: 'bg-neutral-800 text-white',
      habitInput: 'p-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900',
      addHabitBtn: 'ml-2 px-3 py-1 rounded-xl bg-neutral-800 text-white',
    },
    dark: {
      container: 'min-h-screen bg-neutral-900 text-neutral-100 p-4',
      card: 'bg-neutral-800 border border-neutral-700 rounded-xl shadow p-6 mb-6',
      header: 'text-3xl font-bold tracking-tight mb-2 text-neutral-100',
      sub: 'text-neutral-400',
      button: 'ml-4 bg-neutral-700 text-neutral-100 px-3 py-2 rounded-xl hover:bg-neutral-800 border border-neutral-800',
      moodActive: 'bg-neutral-100 text-neutral-900',
      moodInactive: 'hover:bg-neutral-700',
      textarea: 'w-full p-3 border border-neutral-700 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-neutral-100 bg-neutral-900 text-neutral-100',
      addBtn: 'mt-3 w-full bg-neutral-100 text-neutral-900 py-2 px-4 rounded-xl hover:bg-neutral-200 transition-colors',
      input: 'flex-1 p-2 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100',
      date: 'p-2 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100',
      clearBtn: 'p-2 rounded-xl bg-neutral-700 text-neutral-100 border border-neutral-800',
      entryCard: 'bg-neutral-900 border border-neutral-700 rounded-xl shadow p-4',
      entryDate: 'text-sm text-neutral-400',
      entryText: 'text-neutral-100',
      deleteBtn: 'text-red-400 hover:text-red-600 text-sm',
      stats: 'text-neutral-400',
      habitBtn: 'px-3 py-1 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100 mr-2',
      habitActive: 'bg-neutral-100 text-neutral-900',
      habitInput: 'p-2 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-100',
      addHabitBtn: 'ml-2 px-3 py-1 rounded-xl bg-neutral-100 text-neutral-900',
    }
  };

  return (
    <div className={themeClasses[theme].container + ' min-h-screen flex items-center justify-center'}>
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center w-full sm:w-auto">
            <h1 className={themeClasses[theme].header + ' break-words'}>Mood & Habit Tracker</h1>
            <p className={themeClasses[theme].sub}>Track your moods and habits daily</p>
          </div>
          <div className="flex gap-2 justify-center sm:justify-end w-full sm:w-auto">
            <button onClick={() => setTheme('light')} className={themeClasses[theme].button}>☀️</button>
            <button onClick={() => setTheme('dark')} className={themeClasses[theme].button}>🌙</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {['😊', '😢', '😡', '😴', '🤔'].map(emoji => (
            <button
              key={emoji}
              onClick={() => filterByMood(emoji)}
              className={`text-2xl px-3 py-2 rounded-xl border ${themeClasses[theme].button}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className={themeClasses[theme].card + ' w-full'}>
          <div className="mb-4">
            <label className={themeClasses[theme].sub}>How are you feeling?</label>
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {['😊', '😢', '😡', '😴', '🤔'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMood(emoji)}
                  className={`text-2xl p-2 rounded ${mood === emoji ? themeClasses[theme].moodActive : themeClasses[theme].moodInactive}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <label className={themeClasses[theme].sub}>Select habits</label>
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center gap-1">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={selectedHabits.includes(habit.id) ? `${themeClasses[theme].habitBtn} ${themeClasses[theme].habitActive}` : themeClasses[theme].habitBtn}
                  >
                    {habit.name}
                  </button>
                  <span className="text-xs text-green-600">{getStreak(habit.id)}🔥</span>
                  <button
                    onClick={() => markHabitComplete(habit.id)}
                    className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs"
                  >
                    Mark Complete
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center mb-2 gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                placeholder="Add new habit"
                className={themeClasses[theme].habitInput + ' w-full sm:w-auto'}
              />
              <button onClick={addHabit} className={themeClasses[theme].addHabitBtn + ' w-full sm:w-auto'}>Add</button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Notes for today..."
            className={themeClasses[theme].textarea + ' w-full'}
          />
          <button
            onClick={addEntry}
            className={themeClasses[theme].addBtn + ' w-full'}
          >
            Add Entry
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entries..."
            className={themeClasses[theme].input + ' w-full sm:w-auto'}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className={themeClasses[theme].date + ' w-full sm:w-auto'}
          />
          <button
            onClick={() => { setSearch(''); setDateFilter(''); }}
            className={themeClasses[theme].clearBtn + ' w-full sm:w-auto'}
          >
            Clear
          </button>
        </div>
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className={themeClasses[theme].sub}>No entries yet. Start tracking!</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div key={entry.id} className={themeClasses[theme].entryCard + ' w-full'}>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.mood}</span>
                    <span className={themeClasses[theme].entryDate}>{entry.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(entry)}
                      className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className={themeClasses[theme].deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {editId === entry.id ? (
                  <div className="mb-2">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className={themeClasses[theme].textarea + ' w-full'}
                    />
                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                      {['😊', '😢', '😡', '😴', '🤔'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setEditMood(emoji)}
                          className={`text-2xl p-2 rounded ${editMood === emoji ? themeClasses[theme].moodActive : themeClasses[theme].moodInactive}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                      {habits.map(habit => (
                        <button
                          key={habit.id}
                          onClick={() => setEditHabits(editHabits.includes(habit.id) ? editHabits.filter(hid => hid !== habit.id) : [...editHabits, habit.id])}
                          className={editHabits.includes(habit.id) ? `${themeClasses[theme].habitBtn} ${themeClasses[theme].habitActive}` : themeClasses[theme].habitBtn}
                        >
                          {habit.name}
                        </button>
                      ))}
                    </div>
                    <button onClick={saveEdit} className="px-3 py-1 rounded bg-blue-600 text-white w-full sm:w-auto">Save</button>
                  </div>
                ) : (
                  <>
                    <p className={themeClasses[theme].entryText}>{entry.text}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {entry.habits.map((habit, idx) => (
                        <span key={idx} className={themeClasses[theme].habitBtn}>{habit}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        {filteredEntries.length > 0 && (
          <div className="mt-8 text-center">
            <p className={themeClasses[theme].stats}>
              Total entries: <span className="font-semibold">{filteredEntries.length}</span>
            </p>
          </div>
        )}
        {editId !== null && (
          <div className={themeClasses[theme].card + ' mt-6 w-full'}>
            <h2 className={themeClasses[theme].header}>Edit Entry</h2>
            <div className="mb-4">
              <label className={themeClasses[theme].sub}>How are you feeling?</label>
              <div className="flex flex-wrap gap-2 mb-2 justify-center">
                {['😊', '😢', '😡', '😴', '🤔'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setEditMood(emoji)}
                    className={`text-2xl p-2 rounded ${editMood === emoji ? themeClasses[theme].moodActive : themeClasses[theme].moodInactive}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <label className={themeClasses[theme].sub}>Select habits</label>
              <div className="flex flex-wrap gap-2 mb-2 justify-center">
                {habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => setEditHabits(editHabits.includes(habit.id) ? editHabits.filter(hid => hid !== habit.id) : [...editHabits, habit.id])}
                    className={editHabits.includes(habit.id) ? `${themeClasses[theme].habitBtn} ${themeClasses[theme].habitActive}` : themeClasses[theme].habitBtn}
                  >
                    {habit.name}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Notes for today..."
              className={themeClasses[theme].textarea + ' w-full'}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={saveEdit}
                className={themeClasses[theme].addBtn + ' w-full sm:w-auto'}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditId(null)}
                className={themeClasses[theme].button + ' w-full sm:w-auto'}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;