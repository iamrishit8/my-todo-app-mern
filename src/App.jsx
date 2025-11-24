import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FocusMode from './components/FocusMode';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './services/api';
import { isToday, isUpcoming } from './utils/dateUtils';

function App() {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const [counts, setCounts] = useState({ inbox: 0, today: 0, upcoming: 0 });

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const today = new Date().setHours(0,0,0,0);
    setCounts({
      inbox: todos.length,
      today: todos.filter(t => t.dueDate && new Date(t.dueDate).setHours(0,0,0,0) === today).length,
      upcoming: todos.filter(t => t.dueDate && new Date(t.dueDate).setHours(0,0,0,0) > today).length
    });
  }, [todos]);

  const loadTodos = async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) { console.error(err); }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([newTodo, ...todos]);
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleTodo = async (id) => {
    const todo = todos.find(t => t._id === id);
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => (t._id === id ? updated : t)));
    } catch (err) { console.error(err); }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
        const updated = await updateTodo(id, updates);
        setTodos(todos.map(t => (t._id === id ? updated : t)));
    } catch (err) { console.error(err); }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  // Filter Logic: Tab + Search
  const filteredTodos = todos.filter(t => {
    // 1. Search Filter
    if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
    }
    // 2. Tab Filter
    if (activeTab === 'today') return isToday(t.dueDate);
    if (activeTab === 'upcoming') return isUpcoming(t.dueDate);
    return true; // Inbox
  });

  const getTitle = () => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (activeTab === 'inbox') return 'Inbox';
    if (activeTab === 'today') return "Today's Plan";
    return 'Upcoming';
  };

  return (
    <div className="min-h-screen transition-colors duration-300 selection:bg-violet-500/30">
      <div className="aurora-bg"></div>
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        toggleTheme={toggleTheme}
        todoCounts={counts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="lg:ml-72 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2 text-slate-900 dark:text-white tracking-tight transition-colors">
              {getTitle()}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <div className="relative z-0 mb-32">
            <TodoList 
              todos={filteredTodos} 
              onToggleTodo={handleToggleTodo} 
              onDeleteTodo={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              onFocus={(task) => setActiveFocusTask(task)}
            />
          </div>

          <div className="fixed bottom-8 left-0 right-0 px-6 lg:left-72 z-20 flex justify-center pointer-events-none">
            <div className="w-full max-w-3xl pointer-events-auto">
                <TodoForm onAddTodo={handleAddTodo} />
            </div>
          </div>
        </div>
      </main>

      {activeFocusTask && (
        <FocusMode 
          task={activeFocusTask} 
          onClose={() => setActiveFocusTask(null)}
          onComplete={(id) => {
            handleToggleTodo(id);
            setActiveFocusTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;