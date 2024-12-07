/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useGetBookmarkPurchase, } from '@/features/bookmarks/use-user-bookmark-purchase'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { Certificate } from '@/types/certificate'
import { CertificateCard } from '@/components/certificates/CertificateCard'
import { CertificatePreview } from '@/components/certificates/CertificatePreview'
import { useCurrentUser } from '@/features/auth/api/user-current-user'
import { Award } from 'lucide-react'

export default function CertificatesPage() {
  const { data: currentUser } = useCurrentUser()

  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const { results: bookmarkedCourses } = useGetBookmarkPurchase()

  // Convertir les cours en certificats
  const certificates: Certificate[] = bookmarkedCourses.map(course => {
    const progress = course.course.progress?.[0]
    const completionRate = progress ? Math.round((progress.completedLessons / course.course.chapters.reduce((acc: number, chapter: { lessons: Array<unknown> }) => acc + chapter.lessons.length, 0)) * 100) : 0
  
    return {
      id: course.course._id,
      title: "Certificat de Réussite",
      type: course.type,
      issueDate: new Date().toISOString(),
      status: completionRate === 100 ? 'issued' : 'pending',
      student: {
        name: currentUser?.name || "Étudiant",
        email: currentUser?.email || "email@example.com"
      },
      course: {
        title: course.course.title || "Sans titre",
        duration: `${course.course.duration || 0} heures (en ligne)`,
        startDate: new Date(course._creationTime).toISOString(),
        endDate: new Date().toISOString()
      },
      instructor: {
        name: "INVEST MASTERY MIND' CEO",
        title: "Ferdinand KOUAGOU"
      },
      completionRate
    }
  })

  const handleGenerateCertificate = (certificate: Certificate) => {
    // Logique pour générer le certificat en image
    console.log("Génération du certificat pour:", certificate.id)
    // Ici, vous pouvez implémenter la logique pour générer le certificat en image
    // et l'enregistrer dans la base de données
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background dark:bg-slate-900 overflow-hidden"
    >
      <div className="h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#0097A7]/20 dark:scrollbar-thumb-[#0097A7]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#0097A7]/40 dark:hover:scrollbar-thumb-[#0097A7]/20 scroll-smooth">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 text-center relative"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-card dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center"
            >
              <Award className="w-8 h-8 text-[#0097A7] dark:text-[#0097A7]/80" />
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#0097A7] via-[#2C7A7B] to-[#D6620F] bg-clip-text text-transparent mb-4">
              Mes Certificats
            </h1>
            <p className="text-muted-foreground dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Découvrez vos certificats de formation et générez-les une fois les cours terminés
            </p>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-24 h-1 bg-gradient-to-r from-[#0097A7] to-[#D6620F] mx-auto mt-6 rounded-full"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto pb-8"
          >
            {certificates.map((certificate, index) => (
            <>
              { certificate.type ==="purchase"  ? (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                >
                  <CertificateCard
                    certificate={certificate}
                    index={index}
                    onSelect={setSelectedCertificate}
                    onGenerate={handleGenerateCertificate}
                  />
                </motion.div>
              ) : null}
            </>
            ))}
          </motion.div>
        </div>
      </div>

      <Dialog 
        open={!!selectedCertificate} 
        onOpenChange={() => setSelectedCertificate(null)}
      >
        <DialogContent className="w-[98vw] max-w-4xl p-0 overflow-hidden bg-card dark:bg-slate-900 max-h-[90vh] my-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-full flex flex-col"
          >
            <DialogTitle className="p-2 text-center text-lg sm:text-xl font-bold text-foreground dark:text-slate-100 sticky top-0 bg-background/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 border-b border-border dark:border-slate-700">
              {selectedCertificate?.title}
            </DialogTitle>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0097A7]/20 dark:scrollbar-thumb-[#0097A7]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#0097A7]/40 dark:hover:scrollbar-thumb-[#0097A7]/20 scroll-smooth">
              <div className="p-1 sm:p-3">
                {selectedCertificate && (
                  <CertificatePreview certificate={selectedCertificate} />
                )}
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
