import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, RotateCcw, Plus, Minus, Trophy } from 'lucide-react';

const FocusMode = ({ task, onClose, onComplete }) => {
  const [duration, setDuration] = useState(25); 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Circle Config
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = duration * 60;
  const progress = timeLeft / totalSeconds;
  const dashOffset = circumference - (progress * circumference);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      // Optional: Play a sound here if you wanted to add audio later
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const adjustTime = (amount) => {
    const newDuration = Math.max(1, Math.min(120, duration + amount));
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsFinished(false);
  };

  const toggleTimer = () => {
    if (isFinished) {
        // If finished, hitting play restarts the session
        resetTimer();
        setIsActive(true);
    } else {
        setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine color based on state
  const ringColor = isFinished ? 'text-emerald-500' : 'text-violet-500';
  const shadowColor = isFinished ? 'drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/95 backdrop-blur-xl animate-in fade-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-transparent hover:bg-white/10 rounded-full transition-all"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-lg flex flex-col items-center relative">
        
        {/* Status Badge */}
        <div className="mb-8">
          {isFinished ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-in zoom-in duration-300">
              <Trophy size={14} />
              Session Complete
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 ${!isActive && 'hidden'}`}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Focus Mode
            </div>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10 px-4 leading-tight max-w-xl">
          {task.text}
        </h2>

        {/* KINETIC RING */}
        <div className="relative mb-12 group">
          <div className={`absolute inset-0 blur-[60px] rounded-full transition-all duration-1000 ${isFinished ? 'bg-emerald-500/30 opacity-50' : isActive ? 'bg-violet-500/20 opacity-100' : 'bg-violet-500/10 opacity-30'}`}></div>
          
          <svg className="transform -rotate-90 w-80 h-80 relative z-10 drop-shadow-2xl">
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={isFinished ? 0 : dashOffset} // Fill completely when finished
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-linear ${ringColor} ${isActive || isFinished ? shadowColor : ''}`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            {isFinished ? (
                <div className="text-center animate-in zoom-in duration-300">
                    <div className="text-5xl font-bold text-white mb-2">Done!</div>
                    <p className="text-slate-400 text-sm">Great focus.</p>
                </div>
            ) : (
                <div className="text-6xl font-mono font-bold text-white tracking-wider tabular-nums relative">
                {formatTime(timeLeft)}
                
                {!isActive && (
                    <div className="absolute -left-16 -right-16 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity px-2">
                    <button 
                        onClick={() => adjustTime(-5)}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <Minus size={24} />
                    </button>
                    <button 
                        onClick={() => adjustTime(5)}
                        className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <Plus size={24} />
                    </button>
                    </div>
                )}
                </div>
            )}
            
            {!isFinished && !isActive && (
              <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-widest">
                {timeLeft === totalSeconds ? 'Ready' : 'Paused'}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTimer}
            className={`h-14 w-14 flex items-center justify-center rounded-full hover:scale-110 transition-all shadow-lg active:scale-95 ${isFinished ? 'bg-white text-black hover:bg-slate-200' : 'bg-white text-black hover:bg-slate-200'}`}
          >
            {isActive ? <Pause size={24} fill="currentColor" /> : isFinished ? <RotateCcw size={24} /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          {!isFinished && (
            <button
                onClick={resetTimer}
                className="h-12 w-12 flex items-center justify-center bg-white/5 text-slate-300 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all"
                title="Reset Timer"
            >
                <RotateCcw size={20} />
            </button>
          )}
          
          <button
            onClick={() => { onComplete(task._id); onClose(); }}
            className={`h-12 px-6 flex items-center gap-2 rounded-full transition-all font-medium ${isFinished ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'}`}
          >
            <CheckCircle2 size={20} />
            <span>Complete Task</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FocusMode;