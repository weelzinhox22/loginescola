import React, { ReactNode } from 'react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ReactNode;
  animationType: 'name' | 'email' | 'password' | 'confirm-password' | 'school' | 'role';
}

export default function FormInput({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  icon,
  animationType
}: FormInputProps) {
  // Clone the icon element with standard class
  const standardIcon = React.cloneElement(icon as React.ReactElement, {
    className: "h-4 w-4 mr-2 text-indigo-400"
  });
  
  return (
    <div className="space-y-2 relative">
      <label 
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-indigo-700 font-medium flex items-center" 
        htmlFor={id}
      >
        {standardIcon}
        {label}
      </label>
      <input
        type={type}
        className="flex h-10 w-full border px-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white/80 border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all rounded-lg py-5"
        placeholder={placeholder}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        aria-describedby={`${id}-description`}
        aria-invalid="false"
      />
    </div>
  );
} 