import React, { useState } from 'react';
import { 
  Plus, 
  GripVertical, 
  MessageSquare, 
  User, 
  Clock, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-highlight-yellow/20' },
  { id: 'review', title: 'Review', color: 'bg-highlight-purple/10' },
  { id: 'done', title: 'Done', color: 'bg-highlight-teal/20' }
];

const difficultyStyles = {
  small: 'border-blue-200 text-blue-600 bg-blue-50',
  medium: 'border-yellow-200 text-yellow-600 bg-yellow-50',
  large: 'border-orange-200 text-orange-600 bg-orange-50',
  critical: 'border-red-200 text-red-600 bg-red-50'
};

export default function KanbanBoard({ 
  tasks, 
  onMoveTask, 
  onCreateTask, 
  canManage, 
  contributors,
  user,
  onPick,
  onSubmitPR
}) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onMoveTask(taskId, columnId);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
        {COLUMNS.map(column => (
          <div 
            key={column.id}
            className={`flex-1 min-w-[280px] flex flex-col bg-white border-2 border-primary rounded-xl overflow-hidden shadow-neo-sm ${column.color}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b-2 border-primary bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-black uppercase text-xs tracking-widest text-primary">
                  {column.title}
                </h3>
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-black">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              {column.id === 'todo' && canManage && (
                <button 
                  onClick={onCreateTask}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-primary/10"
                >
                  <Plus size={16} className="text-primary" />
                </button>
              )}
            </div>

            {/* Tasks List */}
            <div className="p-3 flex flex-col gap-3 min-h-[440px]">
              {tasks.filter(t => t.status === column.id).map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  draggable={canManage || task.assignedTo?._id === user?._id}
                  user={user}
                  onPick={onPick}
                  onSubmitPR={onSubmitPR}
                />
              ))}
              
              {tasks.filter(t => t.status === column.id).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 opacity-20 grayscale scale-75 select-none text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-primary border-dashed flex items-center justify-center mb-2">
                    <Clock size={24} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Queue Clear</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onDragStart, onDragEnd, draggable, user, onPick, onSubmitPR }) {
  const [showPRInput, setShowPRInput] = useState(false);
  const [prLink, setPrLink] = useState('');

  const isAssigned = task.assignedTo?._id === user?._id;
  const canPick = task.status === 'todo' && !task.assignedTo && user?.userType === 'student';

  return (
    <div 
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, task._id)}
      onDragEnd={onDragEnd}
      className={`group bg-white border-2 border-primary p-4 rounded-xl shadow-neo-sm hover:shadow-neo transition-all cursor-grab active:cursor-grabbing ${!draggable ? 'opacity-90' : ''}`}
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider ${difficultyStyles[task.difficulty || 'small']}`}>
          {task.difficulty || 'small'}
        </div>
        {draggable && <GripVertical size={14} className="text-slate-300 group-hover:text-primary transition-colors shrink-0" />}
      </div>

      <h4 className="font-black text-xs text-primary leading-tight mb-2 line-clamp-2 uppercase">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-[10px] text-slate-500 font-medium mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Dynamic Action Buttons */}
      <div className="mb-4">
        {canPick && (
          <button 
            onClick={() => onPick(task._id)}
            className="w-full py-2 bg-highlight-blue/20 border-2 border-primary border-dashed text-[9px] font-black uppercase hover:bg-highlight-blue transition-all"
          >
            Grab Task
          </button>
        )}

        {task.status === 'in_progress' && isAssigned && !showPRInput && (
          <button 
            onClick={() => setShowPRInput(true)}
            className="w-full py-2 bg-highlight-purple/20 border-2 border-primary border-dashed text-[9px] font-black uppercase hover:bg-highlight-purple transition-all"
          >
            Submit for Review
          </button>
        )}

        {showPRInput && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
            <input 
              type="url" 
              placeholder="GitHub PR Link..."
              className="w-full px-2 py-1.5 border-2 border-primary text-[10px] outline-none"
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => { onSubmitPR(task._id, prLink); setShowPRInput(false); }}
                className="flex-1 py-1.5 bg-primary text-white text-[9px] font-black uppercase"
              >
                Submit
              </button>
              <button 
                onClick={() => setShowPRInput(false)}
                className="px-2 py-1.5 border-2 border-primary text-[9px] font-black uppercase"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mentor Feedback Sticky */}
      {task.mentorFeedback && (
        <div className="mb-4 p-2 bg-highlight-yellow/10 border-l-4 border-highlight-yellow rounded text-[9px] font-medium text-slate-600 italic">
          "{task.mentorFeedback}"
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex -space-x-2">
          {task.assignedTo ? (
            <div className="relative group/avatar">
              <img 
                src={task.assignedTo.profilePicture || `https://ui-avatars.com/api/?name=${task.assignedTo.username}`} 
                className={`w-6 h-6 rounded-full border border-primary bg-white object-cover ${isAssigned ? 'ring-2 ring-highlight-blue ring-offset-1' : ''}`}
                alt={task.assignedTo.username}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-white text-[8px] font-black uppercase rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-neo-mini">
                {isAssigned ? 'Me' : task.assignedTo.username}
              </div>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400">
              <User size={10} />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {task.prLink && (
             <a 
              href={task.prLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-highlight-blue/20 border-2 border-primary rounded-lg text-primary hover:bg-highlight-blue transition-colors shadow-neo-mini"
             >
                <ExternalLink size={10} />
             </a>
          )}
          <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center gap-1">
            <MessageSquare size={10} className="text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
