import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-parchment-100 p-6'
  const hoverStyles = hoverable ? 'hover:shadow-md hover:border-parchment-200 cursor-pointer' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}