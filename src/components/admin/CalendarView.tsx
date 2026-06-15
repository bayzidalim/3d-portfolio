"use client";
import { useState, useMemo } from "react";
import type { Task } from "./TaskModal";

// ─── Helpers ────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isToday(date: Date) {
  return isSameDay(date, new Date());
}

const priorityDot: Record<string, string> = {
  low: "bg-gray-400",
  medium: "bg-blue-400",
  high: "bg-orange-400",
  urgent: "bg-red-400",
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Component ──────────────────────────────────────────
interface CalendarViewProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskAdd: (prefillDate: string) => void;
}

export default function CalendarView({ tasks, onTaskEdit, onTaskAdd }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Tasks indexed by day-of-month
  const tasksByDay = useMemo(() => {
    const map: Record<number, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const d = new Date(t.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(t);
      }
    });
    return map;
  }, [tasks, year, month]);

  // Tasks with no due date
  const unscheduled = useMemo(() => tasks.filter((t) => !t.dueDate), [tasks]);

  const goToPrev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };

  const goToNext = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  // Build calendar grid (6 rows x 7 cols max)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {MONTHS[month]} {year}
          </h3>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden bg-gray-50 dark:bg-white/[0.01]">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/[0.06]">
          {WEEKDAYS.map((day) => (
            <div key={day} className="px-2 py-2.5 text-center text-[10px] uppercase tracking-wider font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dateObj = day ? new Date(year, month, day) : null;
            const dayTasks = day ? (tasksByDay[day] || []) : [];
            const isCurrentDay = dateObj ? isToday(dateObj) : false;
            const isPast = dateObj ? dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate()) : false;

            return (
              <div
                key={i}
                onClick={() => {
                  if (day) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    onTaskAdd(dateStr);
                  }
                }}
                className={`min-h-[90px] md:min-h-[100px] p-1.5 border-b border-r border-gray-200 dark:border-white/[0.04] transition-colors ${
                  day ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.02]" : "bg-gray-50/50 dark:bg-white/[0.005]"
                } ${isCurrentDay ? "bg-indigo-500/[0.04]" : ""}`}
              >
                {day && (
                  <>
                    {/* Day number */}
                    <div className={`text-right mb-1 ${
                      isCurrentDay
                        ? "text-indigo-300 font-bold"
                        : isPast
                          ? "text-gray-600"
                          : "text-gray-400"
                    }`}>
                      <span className={`text-xs inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isCurrentDay ? "bg-indigo-500/30" : ""
                      }`}>
                        {day}
                      </span>
                    </div>

                    {/* Task pills */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <button
                          key={task._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdit(task);
                          }}
                          className={`w-full text-left px-1.5 py-0.5 rounded-md text-[10px] truncate flex items-center gap-1 transition-all hover:brightness-125 cursor-pointer ${
                            task.status === "done"
                              ? "bg-green-500/10 text-green-400/60 line-through"
                              : "bg-gray-100 dark:bg-white/[0.04] text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
                          <span className="truncate">{task.title}</span>
                        </button>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] text-gray-600 pl-1">
                          +{dayTasks.length - 3} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unscheduled tasks */}
      {unscheduled.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.01] p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">No Due Date ({unscheduled.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map((task) => (
              <button
                key={task._id}
                onClick={() => onTaskEdit(task)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} />
                {task.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
