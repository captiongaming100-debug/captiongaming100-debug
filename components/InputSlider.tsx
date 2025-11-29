import React from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  description
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center bg-white border border-slate-300 rounded-md px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <span className="text-slate-500 text-sm font-medium mr-1">{prefix}</span>
            <input
                type="number"
                className="w-24 text-right text-slate-900 font-semibold focus:outline-none"
                value={value}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onChange(val);
                }}
            />
            <span className="text-slate-500 text-sm font-medium ml-1">{suffix}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
};

export default InputSlider;