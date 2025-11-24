import React, { useState, useRef, useEffect } from 'react';
import { Check, Trash2, Calendar, Flag, Zap, Pencil, X, Save, Calendar as CalendarIcon } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import DatePicker from './DatePicker';

const TodoItem = ({ todo, onToggle, onDelete, onFocus, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit States
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDate, setEditDate] = useState(todo.dueDate ? new Date(todo.dueDate) : null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Handle outside clicks for date picker in edit mode
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    if (isEditing) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  const formattedDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue = formattedDate && isPast(formattedDate) && !isToday(formattedDate) && !todo.completed;

  const priorityConfig = {
    High: 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/5',
    Medium: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-400/20 bg-amber-50 dark:bg-amber-400/5',
    Low: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20 bg-blue-50 dark:bg-blue-400/5'
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo._id, { 
        text: editText,
        priority: editPriority,
        dueDate: editDate
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDate(todo.dueDate ? new Date(todo.dueDate) : null);
  };

  // EDIT MODE
  if (isEditing) {
    return (
        // Z-INDEX FIX: 'relative z-50' ensures this card floats above all other list items
        <div className="relative z-50 glass-panel rounded-xl p-4 mb-3 ring-2 ring-violet-500/20 bg-white dark:bg-[#1a1a1a] shadow-2xl">
            <div className="flex flex-col gap-3">
                <input 
                    type="text" 
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-200 dark:border-white/10 pb-2 text-sm outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 relative">
                        {/* Edit Date */}
                        <div ref={datePickerRef} className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 border transition-all ${editDate ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-500/20' : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 border-slate-200 dark:border-white/5'}`}
                            >
                                <CalendarIcon size={12} />
                                {editDate ? format(editDate, 'MMM d') : 'No Date'}
                            </button>
                            {showDatePicker && (
                                // Z-Index 50 for the popup itself
                                <div className="absolute top-full left-0 mt-2 z-50">
                                    <DatePicker 
                                        selectedDate={editDate} 
                                        onChange={(date) => {
                                            setEditDate(date);
                                            setShowDatePicker(false);
                                        }} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Edit Priority */}
                        <div className="flex bg-slate-50 dark:bg-white/5 rounded p-0.5 border border-slate-200 dark:border-white/5">
                            {['Low', 'Medium', 'High'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setEditPriority(p)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                                        editPriority === p 
                                        ? 'bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white shadow-sm' 
                                        : 'text-slate-400 dark:text-gray-500 hover:text-slate-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleCancel} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors">
                            <X size={16} />
                        </button>
                        <button onClick={handleSave} className="p-1.5 text-white bg-violet-600 hover:bg-violet-500 rounded shadow-lg shadow-violet-500/20 transition-all">
                            <Save size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // VIEW MODE
  return (
    // Z-Index 0 ensures unedited items stay below the active one
    <div className="relative z-0 group glass-panel rounded-xl p-4 mb-3 flex items-start gap-4 hover:bg-white dark:hover:bg-white/[0.02] transition-all duration-200 border-l-4 border-l-transparent hover:border-l-violet-500 shadow-sm hover:shadow-md">
      
      <button 
        onClick={onToggle}
        className={`
          mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${todo.completed 
            ? 'bg-slate-400 dark:bg-gray-500 border-slate-400 dark:border-gray-500 text-white' 
            : 'border-slate-300 dark:border-gray-600 hover:border-violet-500 text-transparent hover:bg-violet-50 dark:hover:bg-violet-500/10'}
        `}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onFocus(todo)}>
        <p className={`text-[15px] font-semibold transition-all ${todo.completed ? 'text-slate-400 dark:text-gray-500 line-through' : 'text-slate-700 dark:text-gray-200'}`}>
          {todo.text}
        </p>
        
        {todo.description && (
          <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 truncate font-medium">{todo.description}</p>
        )}

        <div className="flex items-center gap-3 mt-2.5">
          {formattedDate && (
            <span className={`text-xs flex items-center gap-1.5 font-medium ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-gray-500'}`}>
              <Calendar size={12} />
              {format(formattedDate, 'MMM d')}
            </span>
          )}
          
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityConfig[todo.priority]}`}>
            {todo.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
          title="Edit Task"
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={() => onFocus(todo)}
          className="p-2 text-slate-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-lg transition-all"
          title="Focus Mode"
        >
          <Zap size={16} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;