import React from 'react';
import { LayoutDashboard, Calendar } from 'lucide-react';

const Header = ({ todos, filter, onFilterChange }) => {
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="mb-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {getGreeting()}, Dev.
          </h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-200">{progress}%</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Filter Tabs */}
      <nav className="flex p-1 bg-slate-800 rounded-lg">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              filter === f 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;