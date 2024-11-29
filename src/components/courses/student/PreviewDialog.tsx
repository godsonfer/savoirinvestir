/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lesson } from '@/types/course'
import { Play, Lock, Clock, Video, FileText, BookOpen, X } from 'lucide-react'
import { motion } from 'framer-motion'
import parse from 'html-react-parser'
import DOMPurify from 'dompurify'
import { CourseMuxPlayer } from './MuxPlayer'

interface PreviewDialogProps {
    lesson: Lesson
    isLocked?: boolean
}

export const PreviewDialog = ({ lesson, isLocked = false }: PreviewDialogProps) => {
    const getIcon = () => {
        switch (lesson.type) {
            case 'video':
                return <Video className="w-5 h-5 text-[#0097A7]" />
            case 'article':
                return <FileText className="w-5 h-5 text-[#0097A7]" />
            case 'text':
                return <BookOpen className="w-5 h-5 text-[#0097A7]" />
            default:
                return null
        }
    }

    const sanitizeAndParseHTML = (content: string) => {
        const sanitizedContent = DOMPurify.sanitize(content, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        })
        return parse(sanitizedContent)
    }

    if (isLocked) {
        return (
            <div className="flex items-center gap-2 text-white/40">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Contenu verrouillé</span>
            </div>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-all duration-300"
                >
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Aperçu</span>
                </motion.button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black/95 border-white/10 p-0">
                <DialogHeader className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-3">
                            {getIcon()}
                            <span className="font-medium text-white">{lesson.title}</span>
                        </DialogTitle>
                        <button 
                            onClick={() => document.querySelector('button[aria-label="Close"]')?.click()}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="relative">
                    {lesson.type === 'video' && lesson.playbackId ? (
                        <MuxPlayer 
                            playbackId={lesson.playbackId}
                            title={lesson.title}
                        />
                    ) : (
                        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            <div className="prose prose-invert max-w-none">
                                {lesson.content && sanitizeAndParseHTML(lesson.content)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-black/50 border-t border-white/10">
                    <div className="space-y-4">
                        {lesson.description && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/90 prose prose-invert max-w-none text-sm"
                            >
                                {sanitizeAndParseHTML(lesson.description)}
                            </motion.div>
                        )}
                        <div className="flex items-center gap-4 text-white/60">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{lesson.duration} min</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {getIcon()}
                                <span className="text-sm capitalize">{lesson.type}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 
