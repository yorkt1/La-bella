import * as React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-white border border-[#EAE0DC] rounded-2xl p-6',
        hover
          ? 'transition-all duration-300 hover:border-[#C89B7B] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(122,92,82,0.12)] cursor-pointer'
          : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['mb-4', className].join(' ')} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={['font-[family-name:var(--font-playfair)] text-lg text-[#1E1E1E]', className].join(' ')}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
