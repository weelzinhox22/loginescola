import React, { ReactNode, useState } from 'react';

interface FloatingLabelInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

export default function FloatingLabelInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  icon
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="floating-input-container">
      {icon && (
        <div className="floating-icon">
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-6 w-6"
          })}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`floating-input ${icon ? 'floating-input-with-icon' : ''}`}
        placeholder=" " // Empty placeholder needed for CSS selector
      />
      <label className={`floating-label ${isFocused ? 'focused' : ''}`} htmlFor={id}>
        {label}
      </label>
    </div>
  );
} 