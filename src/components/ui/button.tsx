import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-md',
      secondary: 'bg-secondary text-secondary-foreground hover:opacity-80',
      destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-md',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-10 px-4 rounded-lg',
      lg: 'h-12 px-6 text-lg rounded-xl',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
