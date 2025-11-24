import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from './DatePicker';
import { format } from 'date-fns';

const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  // DEFAULT TO TODAY
  const [dueDate, setDueDate] = useState(new Date()); 
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const datePickerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close DatePicker if clicked outside
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      // Collapse form if clicked outside ONLY if text is empty
      if (formRef.current && !formRef.current.contains(event.target) && !text.trim()) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo({ 
        text, 
        description, 
        priority, 
        dueDate: dueDate ? dueDate.toISOString() : null 
      });
      
      // RESET FORM COMPLETELY
      setText('');
      setDescription('');
      setPriority('Low');
      setDueDate(new Date()); // Reset to today
      setIsExpanded(false); // Collapse the form
      setShowDatePicker(false);
    }
  };

  return (
    <div 
      ref={formRef}
      className={`
        relative border transition-all duration-300 rounded-2xl shadow-2xl backdrop-blur-xl
        ${isExpanded 
          ? 'bg-white dark:bg-[#1a1a1a] border-violet-500/30 ring-4 ring-violet-500/10' 
          : 'bg-white/80 dark:bg-[#1a1a1a]/80 border-slate-200 dark:border-white/10 hover:border-violet-500/30'
        }
      `}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="w-full bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 font-semibold"
          />
          
          {isExpanded && (
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows="1"
              className="w-full bg-transparent border-none outline-none text-sm text-slate-600 dark:text-gray-400 resize-none placeholder:text-slate-400 dark:placeholder:text-gray-600"
            />
          )}
        </div>

        <div className={`
          flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-white/5 transition-all duration-300
          ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 h-0 overflow-hidden pt-0 border-none'}
        `}>
          <div className="flex gap-3 relative">
            {/* Date Picker Button */}
            <div ref={datePickerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`
                        px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all border
                        ${dueDate 
                            ? 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10'}
                    `}
                >
                    <CalendarIcon size={14} />
                    {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
                </button>
                
                {showDatePicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-[100]"> 
                        <DatePicker 
                            selectedDate={dueDate} 
                            onChange={(date) => {
                                setDueDate(date);
                                setShowDatePicker(false);
                            }} 
                        />
                    </div>
                )}
            </div>

            {/* Priority Dropdown */}
            <div className="flex bg-slate-50 dark:bg-white/5 rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
                {['Low', 'Medium', 'High'].map(p => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                          priority === p 
                            ? 'bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-white/10' 
                            : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
                type="button" 
                onClick={() => {
                  setIsExpanded(false);
                  setText('');
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={!text.trim()}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
            >
                Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;