import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import Link from 'next/link'

interface MobileActionButtonProps {
    courseId: string
    firstChapterId?: string
    isVisible: boolean
}

export const MobileActionButton = ({ courseId, firstChapterId, isVisible }: MobileActionButtonProps) => (
    <AnimatePresence>
        {isVisible && firstChapterId && (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:hidden"
            >
                        <Link
                            href={`/courses/${courseId}/lecture`}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <Play className="w-5 h-5" />
                            <span>Commencer le cours</span>
                        </Link>
                   
            </motion.div>
        )}
    </AnimatePresence>
) 
