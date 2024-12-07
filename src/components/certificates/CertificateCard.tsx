import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Award, Calendar, Clock, User, BookOpen, Eye, Link } from 'lucide-react'
import { motion } from 'framer-motion'
import { Certificate } from '@/types/certificate'

interface CertificateCardProps {
  certificate: Certificate
  index: number
  onSelect: (cert: Certificate) => void
  onGenerate: (cert: Certificate) => void
}

export const CertificateCard = ({ certificate, index, onSelect, onGenerate }: CertificateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-md h-full flex flex-col">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
        
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0097A7]/20 to-transparent rounded-bl-[100px] transform translate-x-8 -translate-y-8"
          initial={false}
          animate={{
            rotate: [0, 5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />

        <CardContent className="p-6 sm:p-8 relative flex flex-col flex-grow">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                  certificate.status === 'issued'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                <div className="w-2 h-2 rounded-full mr-2 animate-pulse ${
                  certificate.status === 'issued' ? 'bg-green-500' : 'bg-amber-500'
                }" />
                {certificate.status === 'issued' ? 'Émis' : 'En attente'}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center bg-[#0097A7]/10 text-[#0097A7] px-4 py-1.5 rounded-full border border-[#0097A7]/20"
              >
                <Award className="w-4 h-4 mr-2" />
                <span className="font-medium">{certificate.completionRate}% complété</span>
              </motion.div>
            </div>

            <div className="space-y-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#0097A7]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#0097A7]/20 pr-2">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent">
                  {certificate.title}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#0097A7] to-[#D6620F] rounded-full" />
              </div>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 p-5 rounded-xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-[#0097A7]" />
                    Informations du cours
                  </h3>
                  <div className="space-y-3 ml-7">
                    <p className="text-gray-700 font-medium">{certificate.course.title}</p>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-[#0097A7]" />
                        {certificate.course.duration}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-[#0097A7]" />
                      <span className="text-sm">
                        Du {new Date(certificate.course.startDate).toLocaleDateString('fr-FR')}
                        <br />
                        au {new Date(certificate.course.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 p-5 rounded-xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#0097A7]" />
                    Formateur
                  </h3>
                  <div className="ml-7">
                    <p className="text-gray-700 font-medium">{certificate.instructor.name}</p>
                    <p className="text-gray-500 text-sm">{certificate.instructor.title}</p>
                  </div>
                </motion.div>
                <div className="flex">
                  <p className="text-gray-500 text-sm flex items-center justify-end">
                    <Link className="w-4 h-4 mr-2" />
                    <a href="https://www.investmasterymind.pro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground">www.investmasterymind.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 space-y-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm flex items-center justify-end">
                <Calendar className="w-4 h-4 mr-2" />
                Émis le {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}
              </p>

              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full group hover:bg-[#0097A7] hover:text-white hover:border-transparent transition-all duration-300"
                    onClick={() => onSelect(certificate)}
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:text-white transition-colors" />
                    Aperçu
                  </Button>
                </motion.div>

                {certificate.status === 'issued' ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-r from-[#0097A7] to-[#D6620F] hover:opacity-90 transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </motion.div>
                ) : certificate.completionRate === 100 && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-r from-[#0097A7] to-[#D6620F] hover:opacity-90 transition-all duration-300"
                      onClick={() => onGenerate(certificate)}
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Générer
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 
