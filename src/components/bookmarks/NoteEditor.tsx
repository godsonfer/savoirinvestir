import { Pencil } from "lucide-react"
import { useRef, useEffect } from "react"
import { EditingNote } from "@/types/course"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NoteEditorProps {
    courseId: string
    note?: string
    editingNote: EditingNote
    onEdit: (courseId: string, note?: string) => void
    onSave: (courseId: string, note: string) => void
    onCancel: () => void
}

export const NoteEditor = ({
    courseId,
    note,
    editingNote,
    onEdit,
    onSave,
    onCancel
}: NoteEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (editingNote && textareaRef.current) {
            textareaRef.current.focus()
            const length = textareaRef.current.value.length
            textareaRef.current.setSelectionRange(length, length)
        }
    }, [editingNote])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            if (editingNote?.note.trim()) {
                onSave(courseId, editingNote.note)
            }
        }
        if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
        }
    }

    if (editingNote?.courseId === courseId) {
        return (
            <div className="flex flex-col gap-3">
                <Textarea
                    ref={textareaRef}
                    value={editingNote.note}
                    onChange={(e) => onEdit(courseId, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez votre note ici..."
                    className={cn(
                        "min-h-[120px] resize-none",
                        "bg-white/5 border-gray-800",
                        "focus:border-emerald-500/50 focus:ring-emerald-500/25",
                        "placeholder:text-gray-500 text-gray-200"
                    )}
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="space-x-1">
                        <kbd className="px-2 py-1 rounded bg-gray-800/50 text-gray-400">
                            Ctrl + Entrée
                        </kbd>
                        <span>pour sauvegarder</span>
                        <span className="mx-2">•</span>
                        <kbd className="px-2 py-1 rounded bg-gray-800/50 text-gray-400">
                            Échap
                        </kbd>
                        <span>pour annuler</span>
                    </div>
                    <span>
                        {editingNote.note.length} caractères
                    </span>
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-300 bg-gray-800/50 hover:bg-gray-800 border-gray-700"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => onSave(courseId, editingNote.note)}
                        disabled={!editingNote.note.trim()}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        Sauvegarder
                    </Button>
                </div>
            </div>
        )
    }

    if (note) {
        return (
            <div className="group flex items-start justify-between gap-2">
                <p className="text-sm text-gray-300 leading-relaxed">
                    {note}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit(courseId, note)
                    }}
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-gray-400 hover:text-emerald-400 hover:bg-white/5"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="ghost"
            onClick={(e) => {
                e.stopPropagation()
                onEdit(courseId, '')
            }}
            className="w-full justify-start gap-2 text-gray-400 hover:text-emerald-400 bg-gray-800/50 hover:bg-gray-800"
        >
            <Pencil className="h-4 w-4" />
            <span>Ajouter une note</span>
        </Button>
    )
} 
