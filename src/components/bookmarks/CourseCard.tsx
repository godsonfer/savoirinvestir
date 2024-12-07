/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { BookOpen, Calendar, GraduationCap, Heart, Star, Trash2, User, X, Pencil } from "lucide-react"
import Link from "next/link"
import { EditingNote, ViewMode } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface CourseCardProps {
    isBookmarked : boolean;
    course: {
        id: string;
        liked: boolean;
        course: {
            _id: string;
            title: string;
            description: string;
            cover: string;
            price: number;
            duration: number;
            certification: boolean;
            lastUpdated: string | number;
            chapters: {
                _id: string;
                title: string;
            }[];
        };
    };
    viewMode: ViewMode;
    bookmark: {
        note: string;
        creation: number;
    }; 
    editingNote: EditingNote;
    onLike: () => void;
    onRemove: () => void;
    onEdit: ( note?: string) => void;
    onSaveNote: ( note: string) => void;
    onCancelEdit: () => void;
}

export const CourseCard = ({ 
    isBookmarked,
    course, 
    viewMode,
    editingNote,
    onLike, 
    onRemove,
    onEdit,
    onSaveNote,
    bookmark,
    onCancelEdit
}: CourseCardProps) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isEditing, setIsEditing] = useState(false)
    const [noteText, setNoteText] = useState(bookmark.note || '')
    const [isHovered, setIsHovered] = useState(false)

    const handleStartEdit = () => {
        setNoteText(bookmark.note || '')
        setIsEditing(true)
    }

    const handleSave = () => {
        if (noteText.trim()) {
            onSaveNote(noteText)
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setNoteText(bookmark.note || '')
        setIsEditing(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoteText(e.target.value)
    }

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative rounded-xl overflow-hidden
                ${isDark 
                    ? 'bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-gray-900/90 border-gray-800/50'
                    : 'bg-white border-gray-200'}
                hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                border border-transparent hover:border-emerald-500/20
                backdrop-blur-sm
                ${viewMode === 'list' ? 'flex flex-row items-center h-28' : ''}`}
        >
            {/* Effet de brillance */}
            <motion.div
                initial={false}
                animate={{
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.03] via-transparent to-emerald-500/[0.03]" />
                <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-500/[0.05] to-transparent" />
            </motion.div>

            {/* Image */}
            <motion.div 
                className={`relative overflow-hidden ${viewMode === 'list' 
                    ? 'w-40 h-full shrink-0' 
                    : 'aspect-video'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <img 
                    src={course.course.cover} 
                    alt={course.course.title}
                    className={`w-full h-full object-cover
                        ${viewMode === 'list' ? 'rounded-l-xl' : ''}`}
                />
                <motion.div 
                    initial={false}
                    animate={{
                        opacity: isHovered ? 0.4 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"
                />
            </motion.div>

            {/* Contenu */}
            <div className={`relative flex flex-col ${viewMode === 'list' 
                ? 'flex-1 px-5 py-3.5' 
                : 'p-6'}`}
            >
                <div className="flex items-center justify-between gap-4 min-w-0">
                    <div className="min-w-0 flex-1">
                        <motion.h3 
                            initial={false}
                            animate={{
                                color: isHovered ? '#10b981' : isDark ? '#ffffff' : '#111827'
                            }}
                            transition={{ duration: 0.2 }}
                            className="text-base font-medium line-clamp-1 mb-2"
                        >
                            {course.course.title}
                        </motion.h3>

                        <div className="flex items-center gap-5">
                            <motion.div 
                                initial={false}
                                whileHover={{ scale: 1.05, color: '#10b981' }}
                                className="flex items-center gap-1.5 text-sm text-gray-400"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{course.course.chapters.length} chapitres</span>
                            </motion.div>
                            <motion.div 
                                initial={false}
                                whileHover={{ scale: 1.05, color: '#10b981' }}
                                className="flex items-center gap-1.5 text-sm text-gray-400"
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(course.course.lastUpdated).toLocaleDateString()}</span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                href={`/courses/${course.course._id}/lecture/${ course.course.chapters.length > 0 
                                    ? course.course.chapters[0]._id 
                                    : ''}`}
                                className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-medium
                                    bg-gradient-to-r from-emerald-500 to-teal-600
                                    hover:from-emerald-600 hover:to-teal-700
                                    text-white transition-all duration-300
                                    shadow-sm shadow-emerald-500/20"
                            >
                                Continuer
                            </Link>
                        </motion.div>

                        {/* <div className="flex items-center gap-1.5">
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onLike()}
                                className={`p-1.5 rounded-lg transition-colors duration-300 
                                    ${course.liked 
                                        ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' 
                                        : 'bg-gray-100/5 text-gray-400 hover:text-pink-500 hover:bg-pink-500/10'}`}
                            >
                                <Heart className={`w-3.5 h-3.5 ${course.liked ? 'fill-pink-500' : ''}`} />
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onRemove()}
                                className="p-1.5 rounded-lg bg-gray-100/5 text-gray-400 
                                    hover:bg-red-500/10 hover:text-red-500 
                                    transition-colors duration-300"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                        </div> */}
                    </div>
                </div>

                {/* Note */}
                <AnimatePresence>
                    {isBookmarked && bookmark.note && !isEditing && (
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-1.5 mt-2 text-sm text-gray-400"
                        >
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="line-clamp-1">
                                {bookmark.note}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
} 
