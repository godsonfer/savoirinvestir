import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '@/types/course';

interface LessonTransitionProps {
  currentLesson: Lesson | null;
  children: React.ReactNode;
}

export const LessonTransition = ({ currentLesson, children }: LessonTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentLesson?._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 
