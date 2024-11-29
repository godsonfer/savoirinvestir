import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coffee, Heart, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

interface SupportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const SupportDialog = ({ isOpen, onClose }: SupportDialogProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const supportOptions = [
    {
      icon: Coffee,
      label: 'Offrir un café',
      price: '3€',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-500/10',
      textColor: 'text-amber-500',
      description: 'Un petit café pour me soutenir'
    },
    {
      icon: Heart,
      label: 'Faire un don',
      price: '5€',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-500/10',
      textColor: 'text-pink-500',
      description: 'Contribuer au développement'
    },
    {
      icon: Star,
      label: 'Sponsor',
      price: '10€',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-500/10',
      textColor: 'text-yellow-500',
      description: 'Devenir sponsor du cours'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-neutral-900/95 border-white/10 backdrop-blur-sm",
        isMobile ? "w-[95vw] max-w-[95vw] rounded-t-xl mt-auto" : "max-w-md"
      )}>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Soutenir le créateur
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Votre soutien aide à créer plus de contenu de qualité
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 p-4">
          <AnimatePresence>
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 flex items-center justify-between group
                    border-white/10 ${option.hoverColor} transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${option.color}/10 transition-colors duration-300
                      group-hover:${option.color}/20`}>
                      <option.icon className={`w-6 h-6 ${option.textColor}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white group-hover:text-white/90 transition-colors">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-lg font-bold ${option.textColor} 
                      group-hover:scale-110 transition-transform duration-300`}>
                      {option.price}
                    </span>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="text-xs text-gray-400"
                    >
                      Cliquez pour soutenir
                    </motion.div>
                  </div>
                </Button>
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  initial={false}
                  whileHover={{
                    boxShadow: `0 0 20px 2px ${option.color}20`
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-400">
              Tous les paiements sont sécurisés et cryptés
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
