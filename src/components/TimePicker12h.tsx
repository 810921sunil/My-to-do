import React, { useState, useEffect } from 'react';

interface TimePicker12hProps {
  value: string; // "HH:MM" in 24-hour format
  onChange: (val24h: string) => void;
  required?: boolean;
}

export const formatTime12h = (time24?: string): string => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${period}`;
};

export const TimePicker12h: React.FC<TimePicker12hProps> = ({ value, onChange, required }) => {
  // Parse initial 24h value
  const parseVal = (val24: string) => {
    if (!val24) return { hour12: '12', min: '00', period: 'AM' as 'AM' | 'PM' };
    const parts = val24.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    if (isNaN(h)) return { hour12: '12', min: '00', period: 'AM' as 'AM' | 'PM' };
    const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return { hour12: h.toString().padStart(2, '0'), min: m, period };
  };

  const initial = parseVal(value);
  const [hour12, setHour12] = useState(initial.hour12);
  const [min, setMin] = useState(initial.min);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initial.period);

  useEffect(() => {
    const updated = parseVal(value);
    setHour12(updated.hour12);
    setMin(updated.min);
    setPeriod(updated.period);
  }, [value]);

  const emit24h = (h12Str: string, mStr: string, p: 'AM' | 'PM') => {
    let h = parseInt(h12Str, 10);
    if (isNaN(h)) h = 12;
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    const h24Str = h.toString().padStart(2, '0');
    const m24Str = mStr.padStart(2, '0');
    onChange(`${h24Str}:${m24Str}`);
  };

  const handleHourChange = (newH: string) => {
    setHour12(newH);
    emit24h(newH, min, period);
  };

  const handleMinChange = (newM: string) => {
    setMin(newM);
    emit24h(hour12, newM, period);
  };

  const handlePeriodChange = (newP: 'AM' | 'PM') => {
    setPeriod(newP);
    emit24h(hour12, min, newP);
  };

  const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutesList = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  return (
    <div className="flex items-center gap-1.5 bg-[#060813] border border-white/10 rounded-xl p-1.5">
      {/* Hours */}
      <select
        value={hour12}
        onChange={e => handleHourChange(e.target.value)}
        className="bg-transparent text-xs text-gray-200 font-bold font-mono focus:outline-none cursor-pointer"
      >
        {hoursList.map(h => (
          <option key={h} value={h} className="bg-[#0b0f24] text-gray-200">
            {h}
          </option>
        ))}
      </select>

      <span className="text-xs text-gray-400 font-bold font-mono">:</span>

      {/* Minutes */}
      <select
        value={min}
        onChange={e => handleMinChange(e.target.value)}
        className="bg-transparent text-xs text-gray-200 font-bold font-mono focus:outline-none cursor-pointer"
      >
        {minutesList.map(m => (
          <option key={m} value={m} className="bg-[#0b0f24] text-gray-200">
            {m}
          </option>
        ))}
      </select>

      {/* AM / PM Toggle Buttons */}
      <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg ml-auto">
        <button
          type="button"
          onClick={() => handlePeriodChange('AM')}
          className={`px-2 py-0.5 text-[10px] font-extrabold rounded transition-all ${
            period === 'AM' 
              ? 'bg-blue-600 text-white shadow-glow' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handlePeriodChange('PM')}
          className={`px-2 py-0.5 text-[10px] font-extrabold rounded transition-all ${
            period === 'PM' 
              ? 'bg-purple-600 text-white shadow-glow' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
};
