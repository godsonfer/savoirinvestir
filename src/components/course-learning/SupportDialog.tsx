/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Coffee,
  Heart,
  Crown,
  Sparkles,
  Gift
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { FedaCheckoutButton } from 'fedapay-reactjs'
import { Id } from "../../../convex/_generated/dataModel"
import { usePurchaseCourse } from "@/features/purchases/api/use-purchase-course"
import { toast } from "sonner"

// Déclaration du type global pour FedaPay
declare global {
  interface Window {
    FedaPay: {
      DIALOG_DISMISSED: string;
    };
  }
}

interface SupportDialogProps {
  isOpen: boolean
  onClose: () => void
  courseId?: Id<'courses'>
}

export const SupportDialog = ({ isOpen, onClose, courseId }: SupportDialogProps) => {

  const { mutate: createSupport } = usePurchaseCourse()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const supportOptions = [
    {
      icon: Coffee,
      label: 'Café créatif',
      price: '3€',
      color: 'bg-amber-500',
      hoverColor: 'hover:from-amber-500/20 hover:to-amber-600/20',
      textColor: 'text-amber-500',
      description: 'Pour garder la motivation ☕️',
      link: "https://me.fedapay.com/RLr59TEE"
    },
    {
      icon: Heart,
      label: 'Super supporter',
      price: '5€',
      color: 'bg-pink-500',
      hoverColor: 'hover:from-pink-500/20 hover:to-pink-600/20',
      textColor: 'text-pink-500',
      description: 'Soutenez le projet 💝',
      link: "https://me.fedapay.com/h4QJ1gCA"
    },
    {
      icon: Crown,
      label: 'Sponsor VIP',
      price: '10€',
      color: 'bg-yellow-500',
      hoverColor: 'hover:from-yellow-500/20 hover:to-yellow-600/20',
      textColor: 'text-yellow-500',
      description: 'Fonctinalité premium 👑',
      link: "https://me.fedapay.com/W4E4oQ58"
    },

    {
      icon: Sparkles,
      label: 'Super VIP',
      price: '25€',
      color: 'bg-purple-500',
      hoverColor: 'hover:from-purple-500/20 hover:to-purple-600/20',
      textColor: 'text-purple-500',
      description: 'Fonctinalité premium + Support + Assistance ✨',
      link: "https://me.fedapay.com/c-Yi7hq-"
    },
    {

      icon: Gift,
      label: 'Autre',
      price: 'Selon votre choix',
      color: 'bg-purple-500',
      hoverColor: 'hover:from-purple-500/20 hover:to-purple-600/20',
      textColor: 'text-purple-500',
      description: 'Soutenez le projet avec un montant personnalisé 💝',
      link: "https://me.fedapay.com/SHOaX0jH"
    }
  ]

  // checkout 
  const checkoutButtonOptions = (price: number) => {
    return {
      public_key: 'pk_live_nHzuYzNKHkiVRuw5nDywMtpU',

      transaction: {
        amount: price,
        description: 'Don pour le projet'
      },
      currency: {
        iso: 'XOF'
      },
      button: {
        class: 'btn btn-primary',
        text: ` ${price / 700}€`
      },
      onComplete(resp: { reason: string }) {
        const FedaPay = window.FedaPay;
        if (resp.reason === FedaPay.DIALOG_DISMISSED) {
          toast.error('Vous avez annulé le don');
        } else {
          courseId && createSupport({ courseId }, {
            onSuccess: () => {
              toast.success('Don terminée: ' + resp.reason);
            },
            onError: () => {
              toast.error('Une erreur est survenue lors de la donation');
            }
          })
        }
      }
    }
  };

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 ",
        "dark:backdrop-blur-2xl shadow-2xl",
        "border border-white/10",
        "transition-all duration-500 ease-out",
        isMobile
          ? "w-full max-w-full rounded-t-2xl fixed left-1/2 -translate-x-1/2  p-2 pb-0 mx-auto"
          : "max-w-xl rounded-3xl"
      )}>
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={cn(
            "absolute -top-12 left-1/2 -translate-x-1/2",
            "w-16 h-1.5 bg-white/20 rounded-full",
            "transition-all duration-300",
            isMobile ? "block" : "hidden"
          )} />

          <DialogHeader className={cn(
            "space-y-2",
            isMobile ? "pt-1 pb-1" : "pt-6"
          )}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="space-y-1"
            >
              <DialogTitle className={cn(
                "font-bold text-center",
                "bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent",
                "transition-all duration-300",
                isMobile ? "text-xl" : "text-3xl md:text-4xl"
              )}>
                Soutenez l&apos;aventure
              </DialogTitle>
              <DialogDescription className={cn(
                "text-center text-gray-400/90 mx-auto",
                "transition-all duration-300",
                isMobile ? "text-xs max-w-[250px]" : "text-lg max-w-md"
              )}>
                Votre soutien permet de créer du contenu de qualité et gratuit pour tous
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <div className={cn(
            "grid",
            isMobile ? "gap-2 px-1" : "gap-4 p-6"
          )}>
            <AnimatePresence>
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.label}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="relative"
                >
                  <div
                    className={cn(
                      "w-full h-auto flex items-center justify-between",
                      "bg-gradient-to-r from-white/5 to-transparent",
                      "border border-white/10",
                      "transition-all duration-500 ease-out",
                      "hover:border-white/20 hover:shadow-lg hover:shadow-white/5",
                      "rounded-xl overflow-hidden",
                      option.hoverColor,
                      isMobile ? "p-3" : "p-6"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { type: "spring", stiffness: 400 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          y: [0, -5, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        className={cn(
                          "rounded-xl",
                          "bg-gradient-to-br from-white/10 to-white/5",
                          "transition-all duration-300",
                          `${option.color}/20`,
                          isMobile ? "p-2.5" : "p-4"
                        )}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, 0],
                            transition: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              times: [0, 0.5, 1]
                            }
                          }}
                        >
                          <option.icon className={cn(
                            option.textColor,
                            "transition-transform duration-300",
                            isMobile ? "w-5 h-5" : "w-8 h-8"
                          )} />
                        </motion.div>
                      </motion.div>
                      <div className="text-left flex-1">
                        <h3 className={cn(
                          "font-semibold text-white/90 group-hover:text-white",
                          isMobile ? "text-sm" : "text-xl"
                        )}>
                          {option.label}
                        </h3>
                        <p className={cn(
                          "text-gray-400 group-hover:text-gray-300",
                          isMobile ? "text-xs mt-0.5" : "text-base mt-1"
                        )}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "font-bold transition-all duration-300",
                        option.textColor,
                        "group-hover:scale-110 rounded-lg",
                        "bg-white/5 hover:bg-white/10",
                        "px-4 py-2",
                        isMobile ? "text-base" : "text-xl"
                      )}>
                        <a target="_blank" href={option.link} className={cn(
                          "text-gray-400 text-xs mt-1",
                          "group-hover:text-gray-300"
                        )}>
                          Soutnenir
                        </a>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className={cn(
                "flex flex-col   items-center justify-center gap-1.5",
                "text-gray-400/80 hover:text-gray-300",
                "transition-all duration-300",
                isMobile ? "mt-2 text-[10px]" : "mt-6 text-sm"
              )}
            >
              <div className="flex">
                <p>
                  Par <strong>Dogecoin</strong> ( <span> </span> <span className="font-bold text-sky-600 ">  {' '}9yWznUpu91cGz5H9WbeXahVL3ZJDpB5d6Y</span>)
                </p>
              </div>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Paiements sécurisés et cryptés
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 
