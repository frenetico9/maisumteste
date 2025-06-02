
import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ options, label, id, value, onChange, className, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-300 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 bg-secondary-700 border border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-100 ${className || ''}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-secondary-700 text-secondary-100">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
