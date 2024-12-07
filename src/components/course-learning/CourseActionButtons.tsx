/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Bookmark, Share2, Star } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Lesson } from '@/types/course'

interface CourseActionButtonsProps {
  lesson: Lesson
}

export const CourseActionButtons = () => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [note, setNote] = useState('')

  const handleBookmark = (noteText: string) => {
    setIsBookmarked((prev) => !prev)
    setNote(noteText)
    toast.success(isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris")
  }

  return (
    <div className="flex items-center gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bookmark 
              className={`w-5 h-5 ${
                isBookmarked ? 'fill-[#178F65] text-[#178F65]' : 'text-white'
              }`}
            />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#1a1b1a] border-neutral-800">
          <DialogHeader>
            <DialogTitle>Ajouter aux favoris</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="Votre note (optionnel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-neutral-800 border-neutral-700"
            />
            <button
              onClick={() => handleBookmark(note)}
              className="w-full bg-[#178F65] hover:bg-[#2392A2] text-white font-bold py-2 px-4 rounded-md"
            >
              {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Star className="w-5 h-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#1a1b1a] border-neutral-800">
          <DialogHeader>
            <DialogTitle>Noter cette leçon</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#1a1b1a] border-neutral-800">
          <DialogHeader>
            <DialogTitle>Partager cette leçon</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
