import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  url: string
}

export const ShareDialog = ({ isOpen, onClose, title, url }: ShareDialogProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const shareButtons = [
    {
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:bg-blue-500/10 hover:text-blue-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    },
    {
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:bg-sky-500/10 hover:text-sky-500',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:bg-blue-600/10 hover:text-blue-600',
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'hover:bg-red-500/10 hover:text-red-500',
      onClick: () => window.open(`mailto:?subject=${title}&body=${url}`, '_blank')
    },
    {
      icon: Link,
      label: 'Copier le lien',
      color: 'hover:bg-[#0097A7]/10 hover:text-[#0097A7]',
      onClick: () => {
        navigator.clipboard.writeText(url)
        toast.success('Lien copié !')
      }
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "dark:bg-neutral-900/95 dark:text-white  border-white/10 backdrop-blur-sm",
        isMobile ? "w-[95vw] max-w-[95vw] rounded-t-xl mt-auto" : "max-w-md"
      )}>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Partager cette leçon
          </DialogTitle>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-2 bg-white/5 rounded-lg text-sm text-center text-gray-400"
          >
            {title}
          </motion.div>
        </DialogHeader>

        <div className={cn(
          "grid gap-4 p-4",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {shareButtons.map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className={`w-full h-12 ${button.color} border-white/10 
                  transition-all duration-300 group relative overflow-hidden`}
                onClick={button.onClick}
              >
                <motion.div
                  className={`absolute inset-0 ${button.bgColor} opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative flex items-center justify-center gap-2">
                  <button.icon className={`w-5 h-5 ${button.textColor}`} />
                  <span>{button.label}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-white/10"
        >
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 bg-transparent border-none text-sm text-gray-400 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(url)
                toast.success('Lien copié !')
              }}
              className="hover:bg-[#0097A7]/10 hover:text-[#0097A7]"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 
