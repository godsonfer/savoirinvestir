import { Bookmark, Share2, Facebook, Twitter, Linkedin, Link2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner'

interface ActionButtonsProps {
    isBookmarked: boolean
    onBookmark: () => void
    onShare: () => void
    variant?: 'default' | 'compact'
}

const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href
    const text = `Découvrez ce cours`
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }

    if (platform === 'copy') {
        navigator.clipboard.writeText(url)
        toast.success("Lien copié !")
        return
    }

    window.open(shareUrls[platform], '_blank')
}

export const ActionButtons = ({ isBookmarked, onBookmark }: ActionButtonsProps) => (
    <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-8">
        <button 
            onClick={onBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300
                ${isBookmarked 
                    ? 'bg-[#0097A7] border-[#0097A7] text-white' 
                    : 'border-white/20 hover:border-[#0097A7] text-white/90 hover:text-[#0097A7]'
                }`}
        >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            <span className="text-sm font-medium">
                {isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}
            </span>
        </button>

        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-white/20 text-white/90 hover:border-[#D6620F] hover:text-[#D6620F] transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Partager</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md bg-white/95 backdrop-blur-sm border-none mx-4">
                <DialogHeader>
                    <DialogTitle className="text-center">Partager ce cours</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    <button
                        onClick={() => handleShare('facebook')}
                        className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/90 text-white transition-all duration-300"
                    >
                        <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">Partager sur Facebook</span>
                    </button>
                    <button
                        onClick={() => handleShare('twitter')}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white transition-all duration-300"
                    >
                        <Twitter className="w-5 h-5" />
                        <span>Partager sur Twitter</span>
                    </button>
                    <button
                        onClick={() => handleShare('linkedin')}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white transition-all duration-300"
                    >
                        <Linkedin className="w-5 h-5" />
                        <span>Partager sur LinkedIn</span>
                    </button>
                    <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300"
                    >
                        <Link2 className="w-5 h-5" />
                        <span>Copier le lien</span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
) 
