import React from 'react';
import TodoItem from './TodoItem';
import { Layers } from 'lucide-react';

const TodoList = ({ todos, onToggleTodo, onDeleteTodo, onFocus, onUpdate }) => {
  if (todos.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-white/10">
        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Layers className="text-slate-400 dark:text-white/20" size={32} />
        </div>
        <p className="text-slate-500 dark:text-white/40 font-medium">No tasks found in this view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={() => onToggleTodo(todo._id)}
          onDelete={() => onDeleteTodo(todo._id)}
          onFocus={onFocus}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;