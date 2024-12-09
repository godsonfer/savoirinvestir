/* eslint-disable @typescript-eslint/no-unused-vars */
import { Heart, Bookmark, Share2, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import { ShareDialog } from './ShareDialog'
import { SupportDialog } from './SupportDialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import type { Course } from '@/types/course'
import { Id } from '../../../convex/_generated/dataModel'

interface VideoActionButtonsProps {
  onShare?: () => void;
  onSupport?: () => void;
  courseId: Id<'courses'>;
}

export const VideoActionButtons = ({ onShare, onSupport, courseId }: VideoActionButtonsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Je n'aime plus" : "J'aime ajouté");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  return (
    <>
      <div className={cn(
        "flex items-center",
        isMobile ? "w-full justify-between" : "gap-2"
      )}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="transparent"
            size="icon"
            className={`hover:bg-pink-500/10 ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="transparent"
            size="icon"
            className={`hover:bg-yellow-500/10 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            onClick={handleBookmark}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="transparent"
            size="icon"
            className="text-gray-400 hover:text-[#0097A7] hover:bg-[#0097A7]/10"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="transparent"
            size="icon"
            className="text-gray-400 hover:text-green-500 hover:bg-green-500/10"
            onClick={() => setIsSupportOpen(true)}
          >
            <DollarSign className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Formation Gratuite"
        url={window.location.href}
      />

      <SupportDialog
        isOpen={isSupportOpen}
        courseId={courseId}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  );
}; 

