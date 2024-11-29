'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Award, Calendar, Clock, User, BookOpen, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Certificate {
  id: string
  title: string
  issueDate: string
  status: 'pending' | 'issued'
  student: {
    name: string
    email: string
  }
  course: {
    title: string
    duration: string
    startDate: string
    endDate: string
  }
  instructor: {
    name: string
    title: string
  }
  completionRate: number
}

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [certificates] = useState<Certificate[]>([
    {
      id: '1',
      title: 'Certificat de Completion',
      issueDate: '2024-03-20',
      status: 'issued',
      student: {
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com'
      },
      course: {
        title: 'Développement Web Full-Stack',
        duration: '300 heures',
        startDate: '2024-01-15',
        endDate: '2024-03-20'
      },
      instructor: {
        name: 'Marie Martin',
        title: 'Lead Developer & Formatrice'
      },
      completionRate: 98
    },
    {
      id: '2',
      title: "Certificat d'Excellence",
      issueDate: '2024-03-25',
      status: 'pending',
      student: {
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com'
      },
      course: {
        title: 'UX/UI Design Avancé',
        duration: '150 heures',
        startDate: '2024-02-01',
        endDate: '2024-03-25'
      },
      instructor: {
        name: 'Sophie Bernard',
        title: 'UX Designer Senior'
      },
      completionRate: 95
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Mes Certificats</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez vos réalisations et téléchargez vos certificats de formation
          </p>
        </div>
        
        <div className="max-h-[calc(100vh-240px)] overflow-y-auto px-1 custom-scrollbar">
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
            {certificates.map((certificate) => (
              <Card 
                key={certificate.id} 
                className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-[#0097A7]"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        certificate.status === 'issued' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {certificate.status === 'issued' ? 'Émis' : 'En attente'}
                      </span>
                      <span className="flex items-center bg-[#0097A7]/10 text-[#0097A7] px-3 py-1 rounded-full">
                        <Award className="w-4 h-4 mr-1" />
                        {certificate.completionRate}% complété
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {certificate.title}
                    </h2>

                    <div className="space-y-6 mb-8">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-primary" />
                          Informations du cours
                        </h3>
                        <div className="space-y-3 ml-7">
                          <p className="text-gray-700">{certificate.course.title}</p>
                          <p className="text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {certificate.course.duration}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Du {new Date(certificate.course.startDate).toLocaleDateString('fr-FR')} 
                            au {new Date(certificate.course.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-primary" />
                          Formateur
                        </h3>
                        <div className="ml-7">
                          <p className="text-gray-700 font-medium">{certificate.instructor.name}</p>
                          <p className="text-gray-500">{certificate.instructor.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <p className="text-gray-600 text-sm">
                        Date d&apos;émission: {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}
                      </p>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 group hover:bg-primary hover:text-white"
                          onClick={() => setSelectedCertificate(certificate)}
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover:text-white" />
                          Aperu
                        </Button>
                        
                        {certificate.status === 'issued' && (
                          <Button 
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="w-[95vw] max-w-4xl p-2 sm:p-8 max-h-[90vh]">
         
          {selectedCertificate && (
            <div className="overflow-y-auto custom-scrollbar">
              <div className="w-full">
                <div className="p-3 sm:p-8 bg-gradient-to-br from-[#0097A7]/5 to-white rounded-2xl">
                  <div className="relative border-[8px] sm:border-[16px] border-double border-[#0097A7]/20 rounded-xl shadow-lg">
                    <div className="absolute top-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-br from-[#0097A7]/20 to-transparent rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-tl from-[#D6620F]/20 to-transparent rounded-br-lg" />
                    
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0097A7_1px,transparent_1px)] bg-[length:16px_16px] sm:bg-[length:24px_24px] opacity-5" />
                    
                    <div className="relative z-10 p-4 sm:p-12 bg-white/95 backdrop-blur-sm">
                      <div className="absolute top-4 right-4 sm:top-8 sm:left-8">
                        <div className="w-16 sm:w-28 h-16 sm:h-28 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7] to-[#D6620F] rounded-full opacity-10" />
                          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center p-2">
                            <img 
                              src="/logo.svg" 
                              alt="Logo" 
                              className="w-full h-full object-contain"
                              style={{
                                filter: 'brightness(1.1) contrast(1.2)',
                                mixBlendMode: 'multiply'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-6 sm:mb-10 mt-16 sm:mt-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#0097A7] mb-3 sm:mb-4">
                          Certificat de Réussite
                        </h2>
                        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                          <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#0097A7] to-transparent" />
                          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#D6620F]" />
                          <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#0097A7] to-transparent" />
                        </div>
                        <p className="text-slate-600 font-medium text-sm sm:text-base">Ce certificat est décerné à</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-3 sm:mt-4 text-slate-800 font-serif">
                          {selectedCertificate.student.name}
                        </p>
                      </div>

                      <div className="text-center mb-6 sm:mb-10">
                        <p className="text-slate-600 font-medium text-sm sm:text-base">
                          Pour avoir complété avec succès la formation
                        </p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-2 sm:mt-3 text-[#D6620F] font-serif">
                          {selectedCertificate.course.title}
                        </p>
                        <div className="mt-3 sm:mt-4 inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0097A7]/10 rounded-full">
                          <Clock className="w-4 h-4 text-[#0097A7] mr-2" />
                          <span className="text-[#0097A7] font-medium text-sm sm:text-base">
                            {selectedCertificate.course.duration} de formation
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-slate-50 to-[#0097A7]/10 p-3 rounded-xl mb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-[#0097A7] flex-shrink-0" />
                            <div>
                              <p className="font-medium text-slate-700 text-sm sm:text-base">Période de formation</p>
                              <p className="text-xs sm:text-sm text-slate-600">
                                Du {new Date(selectedCertificate.course.startDate).toLocaleDateString('fr-FR')} 
                                au {new Date(selectedCertificate.course.endDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Award className="w-4 h-4 text-[#D6620F]" />
                            <span className="font-medium text-sm text-slate-700">
                              {selectedCertificate.completionRate}% complété
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3 pt-3 border-t border-slate-200">
                        <div className="text-center">
                          <div className="w-32 h-[2px] bg-gradient-to-r from-[#0097A7] to-[#D6620F] mb-1" />
                          <p className="font-bold text-sm sm:text-base text-slate-800">
                            {selectedCertificate.instructor.name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {selectedCertificate.instructor.title}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-1">
                            <div className="w-full h-full relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7] to-[#D6620F] rounded-full opacity-10" />
                              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center p-1">
                                <img 
                                  src="/logo.svg" 
                                  alt="Logo" 
                                  className="w-full h-full object-contain"
                                  style={{
                                    filter: 'brightness(1.1) contrast(1.2)',
                                    mixBlendMode: 'multiply'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600">
                            Certifié le {new Date(selectedCertificate.issueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
