import { forwardRef } from 'react'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  name?: string
  id?: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    type = 'text',
    placeholder,
    value,
    defaultValue,
    disabled = false,
    required = false,
    error,
    label,
    name,
    id,
    className = '',
    onChange,
    onBlur,
    onFocus
  }, ref) => {
    const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
    
    const stateClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    
    const disabledClasses = disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'
    
    const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={classes}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 