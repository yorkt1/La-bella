import * as React from 'react'

type ButtonVariant = 'primary' | 'gold-outline' | 'ghost-rose' | 'dark' | 'danger' | 'whatsapp'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#C89B7B] to-[#7A5C52] text-white hover:opacity-90 shadow-sm shadow-[#C89B7B]/30',
  'gold-outline':
    'border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 bg-transparent',
  'ghost-rose':
    'bg-[#F6E6E6] text-[#7A5C52] hover:bg-[#EAD4D4]',
  dark:
    'bg-[#D4AF37] text-[#1E1E1E] hover:bg-[#C49E2A]',
  danger:
    'bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2]',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#20BD5B]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-7 py-3 text-[13px]',
  lg: 'px-9 py-4 text-[13px]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.05em] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B7B]',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
