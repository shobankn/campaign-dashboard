import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const PRESETS = [
  { label: 'Last 7 days', getDates: () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 6); return [s, e];
  }},
  { label: 'Last 30 days', getDates: () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 29); return [s, e];
  }},
  { label: 'Last 90 days', getDates: () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 89); return [s, e];
  }},
  { label: 'This month', getDates: () => {
    const now = new Date();
    return [new Date(now.getFullYear(), now.getMonth(), 1), now];
  }},
];

function normalize(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function CalendarPanel({ 
  currentMonth, 
  onPrev, 
  onNext, 
  startDate, 
  endDate, 
  hoverDate, 
  onDayClick, 
  onHover, 
  onHoverLeave 
}) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={onPrev} 
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
        </button>
        <span className="text-sm rob-semibold text-gray-800 dark:text-gray-100">
          {MONTHS[month]} {year}
        </span>
        <button 
          onClick={onNext} 
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {DAYS.map(d => (
          <div key={d} className="flex justify-center py-0.5">
            <span className="text-[10px] rob-semibold text-gray-400">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5 text-sm">
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-7" />;

          const thisDay = normalize(new Date(year, month, day));
          const isStart = startDate && isSameDay(thisDay, startDate);
          const isEnd = endDate && isSameDay(thisDay, endDate);
          const inRange = startDate && endDate && thisDay > startDate && thisDay < endDate;
          const inHover = startDate && !endDate && hoverDate && thisDay > startDate && thisDay <= hoverDate;

          let cls = 'h-7 w-full flex items-center justify-center rob-medium transition-all duration-150 cursor-pointer rounded-md text-[13px]';

          if (isStart || isEnd) {
            cls += ' bg-[var(--brand)] text-white font-semibold shadow-md shadow-[var(--brand-glow)]';
          } else if (inRange || inHover) {
            cls += ' bg-[var(--brand)]/10 text-[var(--brand)] dark:bg-[var(--brand)]/20 dark:text-blue-300';
          } else {
            cls += ' text-gray-700 dark:text-gray-300 hover:bg-[var(--brand)]/10 hover:text-[var(--brand)]';
          }

          if (isStart && (endDate || hoverDate)) cls += ' rounded-r-none';
          if (isEnd) cls += ' rounded-l-none';

          return (
            <button
              key={day}
              onClick={() => onDayClick(thisDay)}
              onMouseEnter={() => onHover(thisDay)}
              onMouseLeave={onHoverLeave}
              className={cls}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ startDate, endDate, onChange }) {
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || null);
  const [tempEnd, setTempEnd] = useState(endDate || null);
  const [hoverDate, setHoverDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = startDate || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTempStart(startDate || null);
      setTempEnd(endDate || null);
    }
  }, [open, startDate, endDate]);

  const handleDayClick = (day) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(day);
      setTempEnd(null);
    } else if (day < tempStart) {
      setTempEnd(tempStart);
      setTempStart(day);
    } else {
      setTempEnd(day);
    }
  };

  const handlePreset = (preset) => {
    const [s, e] = preset.getDates();
    setTempStart(normalize(s));
    setTempEnd(normalize(e));
  };

  const handleApply = () => {
    onChange(tempStart, tempEnd);
    setOpen(false);
  };

  const formatLabel = () => {
    if (!startDate && !endDate) return 'Select date range';
    if (startDate && !endDate) {
      return `${startDate.getDate()} ${MONTHS_SHORT[startDate.getMonth()]} ${startDate.getFullYear()}`;
    }
    return `${startDate.getDate()} ${MONTHS_SHORT[startDate.getMonth()]} – ${endDate.getDate()} ${MONTHS_SHORT[endDate.getMonth()]} ${endDate.getFullYear()}`;
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm rob-medium text-gray-700 dark:text-gray-200 hover:border-[var(--brand)]/40 transition-all w-full justify-start"
      >
        <Calendar className="w-4 h-4 text-[var(--brand)]" />
        <span className="truncate">{formatLabel()}</span>
      </button>

      {/* Popup - Compact & Mobile Responsive */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-[320px] sm:w-[320px]">

            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--brand)] to-[#60a5fa] px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm rob-semibold text-white">Select Date Range</h3>
                <button 
                  onClick={() => setOpen(false)} 
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-[10px] text-white/70 rob-medium">Selected Range</p>
                <p className="text-xs rob-semibold text-white">
                  {tempStart
                    ? tempEnd
                      ? `${tempStart.getDate()} ${MONTHS_SHORT[tempStart.getMonth()]} ${tempStart.getFullYear()} – ${tempEnd.getDate()} ${MONTHS_SHORT[tempEnd.getMonth()]} ${tempEnd.getFullYear()}`
                      : `${tempStart.getDate()} ${MONTHS_SHORT[tempStart.getMonth()]} ${tempStart.getFullYear()} – End date`
                    : 'Select start and end dates'}
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p)}
                  className="px-3 py-1 text-xs rob-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[var(--brand)] hover:text-white transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Compact Calendar */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <CalendarPanel
                currentMonth={currentMonth}
                onPrev={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                onNext={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                startDate={tempStart}
                endDate={tempEnd}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onHover={setHoverDate}
                onHoverLeave={() => setHoverDate(null)}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => { setTempStart(null); setTempEnd(null); }}
                className="flex-1 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-sm rob-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-xl text-sm rob-semibold shadow-md shadow-[var(--brand-glow)] transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}