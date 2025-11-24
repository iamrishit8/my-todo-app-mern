import React from 'react';
import { Inbox, Calendar, Sparkles, Search, Moon, Sun, ChevronRight, Hash } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, theme, toggleTheme, todoCounts, searchQuery, setSearchQuery }) => {
  const menuItems = [
    { id: 'inbox', icon: Inbox, label: 'Inbox' },
    { id: 'today', icon: Calendar, label: 'Today' },
    { id: 'upcoming', icon: Sparkles, label: 'Upcoming' },
  ];

  return (
    <aside className="w-20 lg:w-72 h-screen fixed left-0 top-0 glass-panel border-r-0 border-r-slate-200 dark:border-r-white/5 flex flex-col z-40 transition-all duration-300">
      
      {/* Bigger, Better Heading & Logo */}
      <div className="h-32 flex flex-col justify-center px-6 border-b border-transparent dark:border-white/5">
        <div className="flex items-center gap-3">
            {/* Custom SVG Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <span className="hidden lg:block text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Zenith
            </span>
        </div>
        <p className="hidden lg:block text-xs font-medium text-slate-400 dark:text-white/40 mt-1 pl-1">
            Focus. Organize. Achieve.
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-6 mt-6 mb-2 hidden lg:block">
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={16} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..." 
                className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-violet-500/50 rounded-xl py-2 pl-10 pr-4 text-sm outline-none text-slate-700 dark:text-gray-200 placeholder:text-slate-400 transition-all"
            />
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 px-3 lg:px-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-center lg:justify-start lg:px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.id 
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon 
              size={20} 
              className={`transition-colors ${activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'group-hover:text-slate-900 dark:group-hover:text-slate-300'}`} 
            />
            <span className="hidden lg:block ml-3 text-[14px]">
              {item.label}
            </span>
            
            {todoCounts[item.id] > 0 && (
              <span className="hidden lg:block ml-auto text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                {todoCounts[item.id]}
              </span>
            )}
          </button>
        ))}

        <div className="pt-6 pb-2">
            <div className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:block mb-2">Projects</div>
            <button className="w-full flex items-center justify-center lg:justify-start lg:px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Hash size={18} className="text-orange-500 mr-3" />
                <span className="hidden lg:block text-sm">Personal</span>
            </button>
            <button className="w-full flex items-center justify-center lg:justify-start lg:px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <Hash size={18} className="text-blue-500 mr-3" />
                <span className="hidden lg:block text-sm">Work</span>
            </button>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 lg:p-6 border-t border-transparent dark:border-white/5">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-center lg:justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="hidden lg:block text-sm font-medium">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;