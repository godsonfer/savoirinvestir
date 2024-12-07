'use client'

import { motion } from "framer-motion"

interface LearningTipsProps {
  mistakes: string[]
}

export function LearningTips({ mistakes }: LearningTipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="font-semibold text-blue-800 dark:text-blue-200">
            Conseils d&apos;apprentissage
          </h4>
        </div>
        <ul className="space-y-3">
          {mistakes.map((mistake, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2 text-blue-700 dark:text-blue-300"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="flex-1">{mistake}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
} 
