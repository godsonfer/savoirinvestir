/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Mic, Paperclip, Send, Reply, MoreVertical, Trash2, Image, Video, FileText } from 'lucide-react'
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  type: 'text' | 'audio'
  replies?: Comment[]
}

const DEMO_COMMENTS: Comment[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: '/avatars/john.jpg'
    },
    content: 'Super cours, très instructif ! J\'ai particulièrement apprécié la partie sur les concepts avancés.',
    createdAt: new Date('2024-03-15T10:30:00'),
    type: 'text',
    replies: [
      {
        id: '2',
        user: {
          id: '2',
          name: 'Jane Smith',
          avatar: '/avatars/jane.jpg'
        },
        content: 'Totalement d\'accord ! Les exemples pratiques sont très utiles.',
        createdAt: new Date('2024-03-15T11:00:00'),
        type: 'text'
      }
    ]
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Alice Johnson',
      avatar: '/avatars/alice.jpg'
    },
    content: '/audio/comment.mp3',
    createdAt: new Date('2024-03-14T15:20:00'),
    type: 'audio'
  }
];

const CommentItem = ({ comment, onReply, level = 0 }: { comment: Comment; onReply: (commentId: string) => void; level?: number }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id);
      setReplyContent('');
      setIsReplying(false);
      toast.success("Réponse envoyée !");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${level > 0 ? 'ml-12' : ''}`}
    >
      <div className="group bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback className="bg-[#0097A7]">{comment.user.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-white">{comment.user.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-neutral-900/95 backdrop-blur-md border-white/10">
                    <DropdownMenuItem className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {comment.type === 'text' ? (
              <p className="text-gray-300 mt-1">{comment.content}</p>
            ) : (
              <div className="mt-2">
                <audio controls className="w-full h-12">
                  <source src={comment.content} type="audio/mpeg" />
                </audio>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-white hover:bg-[#0097A7]"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="w-4 h-4 mr-2" />
                Répondre
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-12"
        >
          <div className="flex gap-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Écrire une réponse..."
              className="min-h-[100px] bg-white/5 border-white/10 resize-none focus:border-[#0097A7]"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(false)}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              className="bg-[#0097A7] hover:bg-[#008697]"
              onClick={handleReply}
            >
              Répondre
            </Button>
          </div>
        </motion.div>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </motion.div>
  );
};

export const CommentsPanel = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [comment, setComment] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (comment.trim() || selectedFiles.length > 0) {
      setComment('');
      setSelectedFiles([]);
      toast.success("Commentaire envoyé !");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Enregistrement démarré");
    } else {
      toast.success("Enregistrement terminé");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "flex-1 overflow-y-auto space-y-6",
        isMobile ? "p-2" : "p-4"
      )}>
        <AnimatePresence>
          {DEMO_COMMENTS.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(commentId) => {
                console.log('Replying to:', commentId);
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div className={cn(
        "shrink-0 border-t border-white/10 bg-black/20",
        isMobile ? "p-2" : "p-4"
      )}>
        <div className="p-4 space-y-4">
          <div className="relative">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="min-h-[100px] pr-24 bg-white/5 border-white/10 resize-none 
                focus:border-[#0097A7] transition-all duration-300
                placeholder:text-gray-400"
            />
            <div className="absolute right-2 bottom-2 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-[#0097A7]/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className={`w-4 h-4 transition-transform duration-300 
                  text-gray-400 hover:text-[#0097A7]`} 
                />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-[#0097A7] hover:bg-[#008697] transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!comment.trim() && selectedFiles.length === 0}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
          />

          <div className={cn(
            "grid gap-2",
            isMobile ? "grid-cols-2" : "grid-cols-3"
          )}>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-[#0097A7]/20 hover:border-[#0097A7] transition-all
                flex items-center justify-center gap-2 h-10"
              onClick={() => {
                fileInputRef.current?.click();
                fileInputRef.current?.setAttribute('accept', '.pdf,.doc,.docx');
              }}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Documents</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-[#0097A7]/20 hover:border-[#0097A7] transition-all
                flex items-center justify-center gap-2 h-10"
              onClick={() => {
                fileInputRef.current?.click();
                fileInputRef.current?.setAttribute('accept', 'image/*');
              }}
            >
              <Image className="w-4 h-4" aria-label="Ajouter des images" />
              <span className="text-sm">Images</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`transition-all flex items-center justify-center gap-2 h-10
                ${isRecording 
                  ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20' 
                  : 'hover:bg-[#0097A7]/20 hover:border-[#0097A7]'}`}
              onClick={handleRecordingToggle}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{isRecording ? 'Arrêter' : 'Audio'}</span>
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white/5 rounded-lg p-2"
            >
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 
                      group hover:bg-[#0097A7]/10 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-xs text-gray-300 truncate max-w-[150px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                      className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 
