"use client"
import { useEffect, useState } from 'react'

export const LastUpdated = () => {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    setDate(new Date().toLocaleDateString())
  }, [])

  return (
    <p className="text-sm text-gray-500">
      Dernière mise à jour : {date}
    </p>
  )
} 
