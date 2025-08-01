import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hover = false,
  padding = 'md'
}: CardProps) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer' : ''
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card 