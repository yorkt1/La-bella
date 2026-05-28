import * as React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B]',
            error ? 'border-[#C62828]' : 'border-[#EAE0DC] hover:border-[#C89B7B]/60',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-[11px] text-[#C62828]">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#7A5C52]/60">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, className = '', id, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1E1E] transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B]',
            error ? 'border-[#C62828]' : 'border-[#EAE0DC] hover:border-[#C89B7B]/60',
            className,
          ].join(' ')}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        {error && <p className="text-[11px] text-[#C62828]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={areaId}
            className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#7A5C52]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={4}
          className={[
            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1E1E1E] placeholder-[#7A5C52]/40 resize-none transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 focus:border-[#C89B7B]',
            error ? 'border-[#C62828]' : 'border-[#EAE0DC] hover:border-[#C89B7B]/60',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-[11px] text-[#C62828]">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
