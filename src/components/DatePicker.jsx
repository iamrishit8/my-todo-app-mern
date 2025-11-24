import React, { useState } from 'react';
import { format, addDays, startOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Sun, Calendar, FastForward, Ban } from 'lucide-react';

const DatePicker = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const quickOptions = [
    { label: 'Today', icon: Calendar, value: new Date(), color: 'text-emerald-500' },
    { label: 'Tomorrow', icon: Sun, value: addDays(new Date(), 1), color: 'text-amber-500' },
    { label: 'Next Week', icon: FastForward, value: addDays(new Date(), 7), color: 'text-violet-500' },
    { label: 'No Date', icon: Ban, value: null, color: 'text-slate-400' },
  ];

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4 px-1 select-none">
      <span className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">
        {format(currentMonth, 'MMMM yyyy')}
      </span>
      <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded text-slate-500 dark:text-gray-400 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <button onClick={handleNextMonth} className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded text-slate-500 dark:text-gray-400 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = day;
      const isSelected = selectedDate && isSameDay(day, new Date(selectedDate));
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isDayToday = isToday(day);
      const isDisabled = isBefore(day, today);

      days.push(
        <button
          key={day.toString()}
          type="button"
          disabled={isDisabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(cloneDay);
          }}
          className={`
            h-8 w-full flex items-center justify-center text-xs rounded-md relative transition-all duration-200 font-medium
            ${isDisabled 
                ? 'text-slate-200 dark:text-white/10 cursor-not-allowed' 
                : !isCurrentMonth 
                    ? 'text-slate-300 dark:text-white/20' 
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:hover:text-white'}
            ${isSelected ? 'bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/30 !opacity-100' : ''}
            ${isDayToday && !isSelected ? 'text-violet-600 dark:text-violet-400 font-bold' : ''}
          `}
        >
          {format(day, "d")}
          {isDayToday && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 bg-violet-500 rounded-full"></div>
          )}
        </button>
      );
      day = addDays(day, 1);
    }
    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  return (
    <div 
        className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 w-[280px] animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5 dark:ring-white/5"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <div className="grid grid-cols-1 gap-1 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
        {quickOptions.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(opt.value);
            }}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 text-sm text-slate-600 dark:text-gray-400 group transition-colors"
          >
            <div className="flex items-center gap-3">
              <opt.icon size={14} className={opt.color} />
              <span className="group-hover:text-slate-900 dark:group-hover:text-gray-200 font-medium">{opt.label}</span>
            </div>
            {opt.value && (
              <span className="text-[10px] text-slate-400 dark:text-white/20 font-mono">
                {format(opt.value, 'EEE')}
              </span>
            )}
          </button>
        ))}
      </div>

      {renderHeader()}
      
      <div className="grid grid-cols-7 mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400 dark:text-white/30 text-center uppercase tracking-wider">{d}</div>
        ))}
      </div>

      {renderCells()}
    </div>
  );
};

export default DatePicker;