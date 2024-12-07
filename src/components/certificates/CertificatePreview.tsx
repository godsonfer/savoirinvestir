import { Award, Clock, Globe, AlertTriangle, Shield } from 'lucide-react'
import { Certificate } from '@/types/certificate'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface CertificatePreviewProps {
  certificate: Certificate
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const CertificatePreview = ({ certificate }: CertificatePreviewProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.21, 1.11, 0.81, 0.99] }}
        className="overflow-hidden"
      >
        <div className="w-full">
          <div className="p-1 bg-gradient-to-br from-[#0097A7]/5 via-white to-[#D6620F]/5 rounded-lg">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative border-[4px] sm:border-[8px] border-double border-[#0097A7]/20 rounded-lg shadow-xl overflow-hidden bg-[#FAFAFA]"
            >
              {/* Coins décoratifs */}
              <div className="absolute top-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-t-2 border-l-2 border-[#0097A7] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-t-2 border-r-2 border-[#0097A7] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-16 sm:h-16 border-b-2 border-l-2 border-[#D6620F] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-16 sm:h-16 border-b-2 border-r-2 border-[#D6620F] rounded-br-lg" />

              {/* Effets de fond */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/5 to-[#D6620F]/5 opacity-20" />
              
              <motion.div 
                className="relative z-10 p-2 sm:p-4 bg-white/90 backdrop-blur-sm"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* En-tête avec Logo et Numéro */}
                <div className="flex justify-between items-start mb-3 sm:mb-6">
                  <div className="w-10 sm:w-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 rounded-full animate-pulse" />
                    <Image 
                      src="/logo.svg" 
                      alt="Logo" 
                      width={128}
                      height={128}
                      className="relative z-10 w-full h-auto"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] sm:text-xs text-gray-500">N° {certificate.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-[8px] sm:text-xs text-gray-500">{new Date(certificate.issueDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Titre et Nom */}
                <div className="text-center mb-3 sm:mb-6">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#0097A7] via-[#2C7A7B] to-[#D6620F] bg-clip-text text-transparent mb-2 sm:mb-3">
                    {certificate.title}
                  </h1>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                    <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-transparent via-[#0097A7] to-transparent" />
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#0097A7]" />
                    <div className="h-0.5 w-6 sm:w-12 bg-gradient-to-r from-transparent via-[#0097A7] to-transparent" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-light mb-1 sm:mb-2">
                    Ce certificat est décerné à
                  </p>
                  <h2 className="text-base sm:text-xl font-bold text-gray-800 font-serif">
                    {certificate.student.name}
                  </h2>
                </div>

                {/* Formation */}
                <div className="text-center mb-3 sm:mb-6">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    Pour avoir complété avec succès la formation
                  </p>
                  <h3 className="text-sm sm:text-lg font-bold text-[#D6620F] mb-2 sm:mb-3 font-serif">
                    {certificate.course.title}
                  </h3>
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#0097A7]/5 to-[#D6620F]/5 rounded-full border border-gray-100">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#0097A7] mr-1 sm:mr-2" />
                    <span className="text-[10px] sm:text-sm text-gray-700 font-medium">
                      {certificate.course.duration}
                    </span>
                  </div>
                </div>

                {/* Signature et Validation */}
                <div className="flex justify-between items-center mb-3 sm:mb-6 pt-2 sm:pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-[#0097A7] to-[#D6620F] mb-1 sm:mb-1.5" />
                    <p className="text-[10px] sm:text-sm font-bold text-gray-800">
                      {certificate.instructor.name}
                    </p>
                    <p className="text-[8px] sm:text-xs text-gray-600">
                      {certificate.instructor.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7] to-[#D6620F] rounded-full opacity-10 animate-pulse" />
                      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#0097A7]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Site Web et Disclaimer */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center">
                    <motion.a
                      href="https://www.investmasterymind.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#0097A7] hover:text-[#D6620F] transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-sm font-medium">www.investmasterymind.com</span>
                    </motion.a>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50/80 to-amber-50/40 backdrop-blur-sm border border-amber-100 rounded-lg p-2 sm:p-3">
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1 sm:space-y-1.5">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-900">Avertissement sur les risques :</p>
                        <p className="text-[8px] sm:text-[10px] text-amber-800 leading-relaxed">
                          Les performances passées ne préjugent pas des performances futures. Le trading et l&apos;investissement comportent des risques significatifs de perte en capital. Ce certificat atteste uniquement de la participation à la formation et ne garantit en aucun cas des résultats futurs. Il est important de :
                        </p>
                        <ul className="list-disc ml-2 space-y-0.5 text-[8px] sm:text-[10px] text-amber-800">
                          <li>Ne jamais investir plus que ce que vous pouvez vous permettre de perdre</li>
                          <li>Comprendre que les marchés financiers sont volatils et imprévisibles</li>
                          <li>Consulter un conseiller financier professionnel avant toute décision d&apos;investissement</li>
                          <li>Faire vos propres recherches et prendre vos propres décisions d&apos;investissement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 
