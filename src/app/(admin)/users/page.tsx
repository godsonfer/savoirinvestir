'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Mail,   Users,   Phone, Calendar, CircleDot, Users2, UserCheck, GraduationCap,   Clock, BookOpen, Star, Shield, Globe,   Bell, LinkIcon, Trash, ArrowUpDown, Search, Filter, RefreshCw,     Mic, Paperclip, X,   Pause, Bold, Italic, ListCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { motion } from 'framer-motion'
import { FaChalkboard } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, MessageSquare, Download } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Select } from '@/components/ui/select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Ajouter cette fonction utilitaire en haut du fichier
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Données factices pour la démonstration
const statsData = [
  { name: 'En ligne', value: 42, color: '#22c55e', icon: <Globe className="h-6 w-6" /> },
  { name: 'Étudiants', value: 150, color: '#3b82f6', icon: <GraduationCap className="h-6 w-6" /> },
  { name: 'Abonnés', value: 89, color: '#f59e0b', icon: <UserCheck className="h-6 w-6" /> },
  { name: 'Enseignants', value: 12, color: '#8b5cf6', icon: <FaChalkboard className="h-6 w-6" /> },
]

const visitsData = [
  { name: 'Lun', visits: 145 },
  { name: 'Mar', visits: 232 },
  { name: 'Mer', visits: 186 },
  { name: 'Jeu', visits: 256 },
  { name: 'Ven', visits: 190 },
  { name: 'Sam', visits: 134 },
  { name: 'Dim', visits: 123 },
]

const mockUsers = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+33 6 12 34 56 78',
    role: 'Étudiant',
    status: 'Actif',
    isOnline: true,
    lastLogin: '2024-03-20',
    registeredAt: '2023-09-15',
    subscribed: true,
    subscription: {
      plan: 'Premium',
      validUntil: '2024-12-31',
    },
    avatar: '/avatars/jean.jpg',
    coursesEnrolled: 3,
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie@example.com',
    phone: '+33 6 98 76 54 32',
    role: 'Enseignant',
    status: 'Actif',
    isOnline: false,
    lastLogin: '2024-03-19',
    registeredAt: '2023-08-20',
    subscribed: true,
    subscription: {
      plan: 'Basic',
      validUntil: '2024-06-30',
    },
    avatar: '/avatars/marie.jpg',
    coursesEnrolled: 5,
  },
  // Ajoutez plus d'utilisateurs ici
]

// Types pour le tri
type SortField = 'name' | 'email' | 'role' | 'status' | 'lastLogin'
type SortOrder = 'asc' | 'desc'

// Ajouter ces types
type Course = {
  id: number
  title: string
  progress: number
  lastAccessed: string
  status: 'completed' | 'in-progress' | 'not-started'
}

type Submission = {
  id: number
  exerciseTitle: string
  submittedAt: string
  grade?: number
  status: 'pending' | 'graded' | 'rejected'
}

type MessageReply = {
  id: number
  content: string
  sentAt: string
  isAdmin: boolean
  senderName: string
  attachments: MessageAttachment[]
}

type MessageWithReplies = Message & {
  replies: MessageReply[]
}

type Message = {
  id: number
  content: string
  sentAt: string
  read: boolean
  replies: MessageReply[]
}

type ReviewResponse = {
  id: number
  content: string
  createdAt: string
  adminName: string
}

type Review = {
  id: number
  courseTitle: string
  rating: number
  comment: string
  createdAt: string
  responses: ReviewResponse[]
}

type Document = {
  id: number
  name: string
  type: string
  size: string
  downloadedAt: string
}

// Ajouter ces données factices
const mockUserDetails = {
  courses: [
    {
      id: 1,
      title: "Introduction au JavaScript",
      progress: 75,
      lastAccessed: "2024-03-19",
      status: 'in-progress'
    },
    {
      id: 2,
      title: "React Avancé",
      progress: 100,
      lastAccessed: "2024-03-15",
      status: 'completed'
    },
    {
      id: 3,
      title: "Node.js Fondamentaux",
      progress: 30,
      lastAccessed: "2024-03-20",
      status: 'in-progress'
    }
  ] as Course[],
  submissions: [
    {
      id: 1,
      exerciseTitle: "TP1 - Variables et Types",
      submittedAt: "2024-03-18",
      grade: 85,
      status: 'graded'
    },
    {
      id: 2,
      exerciseTitle: "TP2 - Fonctions",
      submittedAt: "2024-03-20",
      status: 'pending'
    },
    {
      id: 3,
      exerciseTitle: "TP3 - Objets",
      submittedAt: "2024-03-15",
      grade: 92,
      status: 'graded'
    }
  ] as Submission[],
  messages: [
    {
      id: 1,
      content: "Question sur le module 3 du cours JavaScript",
      sentAt: "2024-03-17",
      read: true,
      replies: [
        {
          id: 1,
          content: "Bien sûr, je peux vous aider. Quelle est votre question spécifique ?",
          sentAt: "2024-03-17",
          isAdmin: true,
          senderName: "Support Pédagogique",
          attachments: []
        },
        {
          id: 2,
          content: "Je ne comprends pas bien la partie sur les closures...",
          sentAt: "2024-03-17",
          isAdmin: false,
          senderName: "Jean Dupont",
          attachments: []
        }
      ]
    },
    {
      id: 2,
      content: "Demande d'aide pour le TP2",
      sentAt: "2024-03-20",
      read: false,
      replies: []
    },
    {
      id: 3,
      content: "Retour sur le dernier exercice",
      sentAt: "2024-03-19",
      read: false,
      replies: []
    }
  ] as MessageWithReplies[],
  reviews: [
    {
      id: 1,
      courseTitle: "Introduction au JavaScript",
      rating: 4,
      comment: "Excellent cours, très instructif !",
      createdAt: "2024-03-15",
      responses: [
        {
          id: 1,
          content: "Merci pour votre retour positif ! N'hésitez pas si vous avez des questions.",
          createdAt: "2024-03-16",
          adminName: "Support Pédagogique"
        }
      ]
    },
    {
      id: 2,
      courseTitle: "React Avancé",
      rating: 5,
      comment: "Contenu très complet et bien expliqué",
      createdAt: "2024-03-10",
      responses: []
    }
  ] as Review[],
  documents: [
    {
      id: 1,
      name: "cours_js_chapitre1.pdf",
      type: "PDF",
      size: "2.4 MB",
      downloadedAt: "2024-03-16"
    },
    {
      id: 2,
      name: "exercice_react.zip",
      type: "ZIP",
      size: "1.8 MB",
      downloadedAt: "2024-03-19"
    },
    {
      id: 3,
      name: "correction_tp1.pdf",
      type: "PDF",
      size: "1.2 MB",
      downloadedAt: "2024-03-17"
    }
  ] as Document[]
}

// Types pour les pièces jointes
type AttachmentType = 'image' | 'audio' | 'file'

type MessageAttachment = {
  id: number
  type: AttachmentType
  url: string
  name: string
  size: string
  duration?: string // Pour les fichiers audio
  thumbnail?: string // Pour les images
}

// Types pour les modèles d'email
type EmailTemplate = {
  id: number
  name: string
  subject: string
  content: string
}

// Modèles d'email
const emailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Bienvenue",
    subject: "Bienvenue sur notre plateforme",
    content: `<p>Bonjour {name},</p>
              <p>Nous sommes ravis de vous accueillir sur notre plateforme.</p>
              <p>Cordialement,<br/>L'équipe</p>`
  },
  {
    id: 2,
    name: "Rappel de cours",
    subject: "Rappel : Votre prochain cours",
    content: `<p>Bonjour {name},</p>
              <p>N'oubliez pas votre prochain cours prévu prochainement.</p>
              <p>Cordialement,<br/>L'équipe</p>`
  },
  // Ajoutez d'autres modèles...
]

// Types pour les formations
type Formation = {
  id: number
  title: string
  category: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  duration: string
  enrolled: number
  isLinked?: boolean
}

// Données factices pour les formations
const mockFormations: Formation[] = [
  {
    id: 1,
    title: "JavaScript Fondamentaux",
    category: "Développement Web",
    level: "Débutant",
    duration: "20h",
    enrolled: 150,
    isLinked: true
  },
  {
    id: 2,
    title: "React Avancé",
    category: "Développement Web",
    level: "Avancé",
    duration: "30h",
    enrolled: 89
  },
  {
    id: 3,
    title: "Node.js et Express",
    category: "Backend",
    level: "Intermédiaire",
    duration: "25h",
    enrolled: 120
  },
  // Ajoutez plus de formations...
]

// Dans le composant UserDetails
function UserDetails({ user }: { user: typeof mockUsers[0] }) {
  const [newReply, setNewReply] = useState<string>('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})

  // Fonction pour gérer l'ajout de fichiers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  // Fonction pour supprimer un fichier
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  // Fonction pour gérer l'enregistrement audio
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: BlobPart[] = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob)
          setAudioURL(audioUrl)
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement audio:', error)
      }
    } else {
      setIsRecording(false)
      // Arrêter l'enregistrement
    }
  }

  // Ajouter la fonction handleReply
  const handleReply = async (messageId: number) => {
    if (!newReply.trim() && attachments.length === 0 && !audioURL) {
      return // Ne rien faire si pas de contenu
    }

    try {
      // Créer un nouvel objet de réponse
      const reply: MessageReply = {
        id: Date.now(),
        content: newReply,
        sentAt: new Date().toISOString(),
        isAdmin: true,
        senderName: "Support Pédagogique",
        attachments: []
      }

      // Traiter les pièces jointes
      if (attachments.length > 0) {
        const processedAttachments: MessageAttachment[] = await Promise.all(
          attachments.map(async (file, index) => ({
            id: Date.now() + index,
            type: file.type.startsWith('image/') 
              ? 'image' 
              : file.type.startsWith('audio/') 
                ? 'audio' 
                : 'file',
            url: URL.createObjectURL(file),
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            ...(file.type.startsWith('image/') && {
              thumbnail: URL.createObjectURL(file)
            }),
            ...(file.type.startsWith('audio/') && {
              duration: 'À calculer' // Vous pouvez ajouter la logique pour calculer la durée
            })
          }))
        )
        reply.attachments = processedAttachments
      }

      // Ajouter l'audio s'il existe
      if (audioURL) {
        reply.attachments.push({
          id: Date.now() + 1000,
          type: 'audio',
          url: audioURL,
          name: 'Enregistrement audio',
          size: 'À calculer',
          duration: 'À calculer'
        })
      }

      console.log('Envoi de la réponse:', {
        messageId,
        reply
      })

      // Réinitialiser les états
      setNewReply('')
      setAttachments([])
      setAudioURL(null)
      setIsRecording(false)

      // Ici, vous pouvez ajouter la logique pour envoyer la réponse au serveur
      // await sendReplyToServer(messageId, reply)

    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error)
      // Gérer l'erreur (afficher une notification, etc.)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="courses">Cours</TabsTrigger>
        <TabsTrigger value="submissions">Exercices</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="reviews">Avis</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[60vh] mt-4 rounded-md border p-4">
        <TabsContent value="profile" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{user.name}</h3>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Abonnement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant={user.subscription.plan === 'Premium' ? 'default' : 'secondary'}>
                  {user.subscription.plan}
                </Badge>
                <div className="text-sm text-gray-500">
                  Expire le: {formatDate(user.subscription.validUntil)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {mockUserDetails.courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <h4 className="font-medium">{course.title}</h4>
                  <div className="text-sm text-gray-500">
                    Dernier accès: {formatDate(course.lastAccessed)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">{course.progress}%</div>
                  <Badge variant={
                    course.status === 'completed' ? 'default' :
                    course.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {course.status === 'completed' ? 'Terminé' :
                     course.status === 'in-progress' ? 'En cours' : 'Non commencé'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {mockUserDetails.submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-1">
                  <h4 className="font-medium">{submission.exerciseTitle}</h4>
                  <div className="text-sm text-gray-500">
                    Soumis le: {formatDate(submission.submittedAt)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {submission.grade && (
                    <div className="text-sm font-medium">
                      Note: {submission.grade}/100
                    </div>
                  )}
                  <Badge variant={
                    submission.status === 'graded' ? 'default' :
                    submission.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {submission.status === 'graded' ? 'Noté' :
                     submission.status === 'pending' ? 'En attente' : 'Rejeté'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {mockUserDetails.documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{document.name}</h4>
                    <div className="text-sm text-gray-500">
                      Taille: {document.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-500">
                    Téléchargé le: {formatDate(document.downloadedAt)}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {mockUserDetails.messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Message principal */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className={`h-4 w-4 ${message.read ? 'text-gray-400' : 'text-blue-500'}`} />
                        <p className={`${message.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {message.content}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Envoyé le: {formatDate(message.sentAt)}
                      </div>
                    </div>
                    {!message.read && (
                      <Badge variant="secondary">Non lu</Badge>
                    )}
                  </div>

                  {/* Réponses */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                      {message.replies.map((reply) => (
                        <div 
                          key={reply.id}
                          className={`flex flex-col ${reply.isAdmin ? 'items-start' : 'items-end'}`}
                        >
                          <div className={`
                            max-w-[80%] rounded-lg p-3
                            ${reply.isAdmin 
                              ? 'bg-gray-100 dark:bg-gray-800' 
                              : 'bg-blue-50 dark:bg-blue-900'}
                          `}>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">
                                {reply.senderName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.sentAt)}
                              </span>
                            </div>
                            <p className="text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section des pièces jointes dans les réponses */}
                  {message.replies.map((reply) => (
                    <div key={reply.id}>
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {reply.attachments.map((attachment) => (
                            <div 
                              key={attachment.id}
                              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                              {attachment.type === 'image' ? (
                                <div className="relative group">
                                  <img 
                                    src={attachment.thumbnail || attachment.url} 
                                    alt={attachment.name}
                                    className="w-20 h-20 object-cover rounded-md cursor-pointer"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                    <Download className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                                  </div>
                                </div>
                              ) : attachment.type === 'audio' ? (
                                <div className="flex items-center gap-2 w-full">
                                  <button
                                    onClick={() => {
                                      const audio = new Audio(attachment.url)
                                      if (isPlaying[attachment.id]) {
                                        audio.pause()
                                      } else {
                                        audio.play()
                                      }
                                      setIsPlaying(prev => ({
                                        ...prev,
                                        [attachment.id]: !prev[attachment.id]
                                      }))
                                    }}
                                    className="p-2 rounded-full bg-blue-100 dark:bg-blue-900"
                                  >
                                    {isPlaying[attachment.id] ? (
                                      <Pause className="h-4 w-4" />
                                    ) : (
                                      <Play className="h-4 w-4" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{attachment.name}</div>
                                    <div className="text-xs text-gray-500">{attachment.duration}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 w-full">
                                  <Paperclip className="h-4 w-4 text-gray-500" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{attachment.name}</div>
                                    <div className="text-xs text-gray-500">{attachment.size}</div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Formulaire de réponse avec pièces jointes */}
                  <div className="mt-4 space-y-2">
                    {/* Prévisualisation des pièces jointes */}
                    {attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {attachments.map((file, index) => (
                          <div key={index} className="relative group">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                                <Paperclip className="h-6 w-6" />
                              </div>
                            )}
                            <button
                              onClick={() => removeAttachment(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Zone de saisie et boutons */}
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Répondre à ce message..."
                          className="w-full px-3 py-2 border rounded-md text-sm
                                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                        />
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={handleFileSelect}
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleRecording}
                        className={isRecording ? 'text-red-500' : ''}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>

                      <Button onClick={() => handleReply(message.id)}>
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {mockUserDetails.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Avis principal */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.courseTitle}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {review.comment}
                    </p>
                    <div className="text-sm text-gray-500">
                      Publié le: {formatDate(review.createdAt)}
                    </div>
                  </div>

                  {/* Réponses aux avis */}
                  {review.responses && review.responses.length > 0 && (
                    <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                      {review.responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {response.adminName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(response.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {response.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulaire de réponse */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Répondre à cet avis..."
                        className="flex-1 px-3 py-2 border rounded-md text-sm
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                 bg-white dark:bg-gray-800"
                      />
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Répondre à l\'avis:', review.id)
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Répondre
                      </Button>
                    </div>
                  </div>

                  {/* Actions supplémentaires */}
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => console.log('Signaler avis:', review.id)}
                    >
                      Signaler
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => console.log('Masquer avis:', review.id)}
                    >
                      Masquer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

// Ajouter ce composant pour le modal d'email
function EmailModal({ 
  user, 
  isOpen, 
  onClose 
}: { 
  user: typeof mockUsers[0]
  isOpen: boolean
  onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
      },
    },
  })

  // Fonction pour charger un modèle
  const loadTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setSubject(template.subject.replace('{name}', user.name))
    editor?.commands.setContent(template.content.replace('{name}', user.name))
  }

  // Fonction pour gérer les pièces jointes
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  // Fonction pour supprimer une pièce jointe
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!subject.trim() || !editor?.getText().trim()) return

    setIsSending(true)
    try {
      // Simuler l'envoi d'email avec pièces jointes
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Email envoyé à:', user.email, {
        subject,
        content: editor?.getHTML(),
        attachments
      })
      onClose()
      // Réinitialiser le formulaire
      setSubject('')
      editor?.commands.setContent('')
      setAttachments([])
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer une notification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Section Modèles */}
          <div className="space-y-2">
            <Label>Modèles d'email</Label>
            <Select
              onValueChange={(value) => {
                const template = emailTemplates.find(t => t.id === parseInt(value))
                if (template) loadTemplate(template)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un modèle" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destinataire */}
          <div className="space-y-2">
            <Label>Destinataire</Label>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Objet */}
          <div className="space-y-2">
            <Label htmlFor="subject">Objet</Label>
            <input
              id="subject"
              className="w-full px-3 py-2 border rounded-md text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Objet de l'email"
            />
          </div>

          {/* Éditeur de texte riche */}
          <div className="space-y-2">
            <Label>Message</Label>
            <div className="border rounded-md p-2 min-h-[200px] bg-white dark:bg-gray-800">
              <div className="border-b pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}
                  >
                    <ListCheck    className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Pièces jointes */}
          <div className="space-y-2">
            <Label>Pièces jointes</Label>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded-md">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Ajouter des fichiers
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !subject.trim() || !editor?.getText().trim()}
          >
            {isSending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Ajouter ce composant pour le modal des formations
function FormationsModal({ 
  user, 
  isOpen, 
  onClose 
}: { 
  user: typeof mockUsers[0]
  isOpen: boolean
  onClose: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFormations, setSelectedFormations] = useState<Set<number>>(
    new Set(mockFormations.filter(f => f.isLinked).map(f => f.id))
  )
  const [filter, setFilter] = useState<{
    category: string
    level: string
  }>({ category: 'all', level: 'all' })

  const filteredFormations = mockFormations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filter.category === 'all' || formation.category === filter.category
    const matchesLevel = filter.level === 'all' || formation.level === filter.level
    return matchesSearch && matchesCategory && matchesLevel
  })

  const categories = Array.from(new Set(mockFormations.map(f => f.category)))
  const levels = Array.from(new Set(mockFormations.map(f => f.level)))

  const toggleFormation = (formationId: number) => {
    setSelectedFormations(prev => {
      const newSet = new Set(prev)
      if (newSet.has(formationId)) {
        newSet.delete(formationId)
      } else {
        newSet.add(formationId)
      }
      return newSet
    })
  }

  const handleSave = () => {
    console.log('Formations liées:', Array.from(selectedFormations))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Lier des formations à {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtres et recherche */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Rechercher une formation..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={filter.category}
              onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.level}
              onValueChange={(value) => setFilter(prev => ({ ...prev, level: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Liste des formations */}
          <div className="h-[400px] overflow-y-auto border rounded-lg">
            {filteredFormations.map((formation) => (
              <div
                key={formation.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedFormations.has(formation.id)}
                    onChange={() => toggleFormation(formation.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <h4 className="font-medium">{formation.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formation.category}</span>
                      <span>•</span>
                      <Badge variant="outline">{formation.level}</Badge>
                      <span>•</span>
                      <span>{formation.duration}</span>
                      <span>•</span>
                      <span>{formation.enrolled} inscrits</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [emailModalUser, setEmailModalUser] = useState<typeof mockUsers[0] | null>(null)
  const [formationModalUser, setFormationModalUser] = useState<typeof mockUsers[0] | null>(null)

  // Fonction de tri
  const sortUsers = (users: typeof mockUsers) => {
    return [...users].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    })
  }

  // Fonction pour changer le tri
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // Filtrer et trier les utilisateurs
  const filteredAndSortedUsers = sortUsers(
    mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculer les indices de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <motion.h1 
          className="text-3xl font-bold text-gray-800 dark:text-white mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gestion des Utilisateurs
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.name}
                    </CardTitle>
                    <div className="text-gray-400" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-3xl font-bold animate-fade-in"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div {...fadeInUp} className="h-[400px]">
            <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle>Distribution des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {statsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} className="h-[400px]">
            <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle>Visites Hebdomadaires</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Users Table Section */}
        <motion.div {...fadeInUp}>
          <Card className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <CardHeader className="sticky top-0 z-20 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Liste des Utilisateurs
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Actualiser
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <div className="relative group flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                             bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <div className="relative">
              <div className="overflow-auto" 
                   style={{ 
                     height: 'calc(100vh - 20rem)',
                     maxHeight: 'calc(100vh - 20rem)' 
                   }}>
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-white/50 backdrop-blur-sm">
                      <TableHead className="bg-white">Utilisateur</TableHead>
                      <TableHead className="bg-white">Contact</TableHead>
                      <TableHead 
                        onClick={() => handleSort('role')} 
                        className="cursor-pointer bg-white"
                      >
                        <div className="flex items-center space-x-1">
                          <span>Rôle</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="bg-white">Inscription & Activité</TableHead>
                      <TableHead className="bg-white">Abonnement</TableHead>
                      <TableHead className="bg-white sticky right-0">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((user, index) => (
                      <TableRow 
                        key={user.id}
                        className="hover:bg-gray-50/50 cursor-pointer"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <CircleDot className={`h-3 w-3 ${user.isOnline ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span>{user.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle>Détails de l'utilisateur</DialogTitle>
                            </DialogHeader>
                            <UserDetails user={user} />
                          </DialogContent>
                        </Dialog>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant={user.role === 'Enseignant' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Inscrit le: {formatDate(user.registeredAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span>Dernière connexion: {formatDate(user.lastLogin)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <BookOpen className="h-4 w-4 text-green-500" />
                              <span>Cours suivis: {user.coursesEnrolled}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <Badge 
                                variant={user.subscription.plan === 'Premium' ? 'default' : 'secondary'}
                                className="mb-1"
                              >
                                {user.subscription.plan}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Shield className="h-4 w-4 text-purple-500" />
                              <span>Expire le: {formatDate(user.subscription.validUntil)}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => window.location.href = `mailto:${user.email}`}
                                className="cursor-pointer"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Contacter</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => setEmailModalUser(user)}
                                className="cursor-pointer"
                              >
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Notifier</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => setFormationModalUser(user)}
                                className="cursor-pointer"
                              >
                                <LinkIcon className="mr-2 h-4 w-4" />
                                <span>Lier à une formation</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => console.log('Inviter au workshop', user.id)}
                                className="cursor-pointer"
                              >
                                <Users className="mr-2 h-4 w-4" />
                                <span>Inviter au workshop</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={() => console.log('Supprimer', user.id)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="sticky bottom-0 border-t dark:border-gray-700 p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    // Afficher seulement les 3 premières pages, la page courante, et les 3 dernières
                    if (
                      pageNumber <= 3 ||
                      pageNumber === currentPage ||
                      pageNumber > totalPages - 3
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (
                      pageNumber === 4 && currentPage > 6 ||
                      pageNumber === totalPages - 3 && currentPage < totalPages - 5
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Ajouter le modal d'email */}
      {emailModalUser && (
        <EmailModal
          user={emailModalUser}
          isOpen={!!emailModalUser}
          onClose={() => setEmailModalUser(null)}
        />
      )}
      
      {/* Ajouter le modal des formations */}
      {formationModalUser && (
        <FormationsModal
          user={formationModalUser}
          isOpen={!!formationModalUser}
          onClose={() => setFormationModalUser(null)}
        />
      )}
    </div>
  )
} 
