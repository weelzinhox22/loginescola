import React, { ReactNode } from 'react';

interface RadioOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface RadioGroupProps {
  id: string;
  name: string;
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

export default function RadioGroup({
  id,
  name,
  label,
  options,
  value,
  onChange,
  icon
}: RadioGroupProps) {
  return (
    <div className="space-y-3 mt-4">
      <label 
        className="text-sm font-medium text-indigo-700 flex items-center gap-2 ml-1" 
        htmlFor={id}
      >
        {icon && React.cloneElement(icon as React.ReactElement, {
          className: "h-5 w-5 text-indigo-500"
        })}
        {label}
      </label>
      
      <div className="radio-group">
        {options.map((option, index) => (
          <div key={`${name}-${option.value}`} className="radio-option">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="radio-input"
            />
            <label htmlFor={`${id}-${option.value}`} className="radio-label">
              {option.icon && (
                <div className="radio-label-icon">
                  {React.cloneElement(option.icon as React.ReactElement, {
                    className: "h-6 w-6"
                  })}
                </div>
              )}
              <div className="radio-label-text">{option.label}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 