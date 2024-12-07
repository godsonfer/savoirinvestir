/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Star,
  Activity,
  MessageSquare,
  Clock,
  Trophy,
  Target,
  TrendingUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Ajouter cette fonction utilitaire
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

type UserHoverCardProps = {
  user: {
    id: number
    name: string
    email: string
    phone: string
    avatar?: string
    role: string
    registeredAt: string
    lastLogin: string
    coursesEnrolled: number
    subscription: {
      plan: string
      validUntil: string
    }
    stats: {
      completionRate: number
      activeStreak: number
      totalTime: string
      achievements: number
      lastActivity: string
    }
    activities: Array<{
      type: 'course' | 'exercise' | 'message'
      title: string
      date: string
    }>
  }
  children: React.ReactNode
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" align="start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-4"
        >
          {/* En-tête avec avatar et info rapide */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Avatar className="h-16 w-16 ring-2 ring-blue-500/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-500/10">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <Badge 
                  variant="outline" 
                  className="mt-1 animate-pulse-slow"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Onglets d'information */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="progress">Progrès</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Taux de complétion</div>
                  <div className="flex items-center space-x-2">
                    <Progress value={user.stats.completionRate} className="h-2" />
                    <span className="text-sm font-medium">{user.stats.completionRate}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Série active</div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{user.stats.activeStreak} jours</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Contacter
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Objectifs atteints</span>
                  </div>
                  <Badge variant="outline">{user.stats.achievements}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Temps total</span>
                  </div>
                  <span className="text-sm font-medium">{user.stats.totalTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Progression</span>
                  </div>
                  <Progress value={75} className="w-20 h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="p-4">
              <div className="space-y-3">
                {user.activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-sm"
                  >
                    {activity.type === 'course' && <BookOpen className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'exercise' && <Activity className="h-4 w-4 text-green-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pied de carte avec abonnement */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{user.subscription.plan}</span>
              </div>
              <Badge variant="outline" className="animate-pulse">
                Expire le {formatDate(user.subscription.validUntil)}
              </Badge>
            </div>
          </div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  )
} 
