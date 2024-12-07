import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, BookOpen, Star } from "lucide-react"
import { formatDate } from "date-fns"

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
  }
  children: React.ReactNode
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 animate-in fade-in-0 zoom-in-95">
        <div className="space-y-4">
          {/* En-tête avec avatar et nom */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-500/10">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-base font-semibold">{user.name}</h4>
              <Badge variant="outline" className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="mr-2 h-4 w-4" />
              {user.email}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="mr-2 h-4 w-4" />
              {user.phone}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="space-y-1">
              <div className="flex items-center text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                Inscrit le
              </div>
              <div className="font-medium">
                {formatDate(user.registeredAt, "dd/MM/yyyy")}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-gray-500">
                <BookOpen className="mr-2 h-4 w-4" />
                Cours suivis
              </div>
              <div className="font-medium">
                {user.coursesEnrolled}
              </div>
            </div>
          </div>

          {/* Abonnement */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {user.subscription.plan}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Expire le {formatDate(user.subscription.validUntil, "dd/MM/yyyy")}
              </Badge>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.location.href = `mailto:${user.email}`}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contacter
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => console.log('Voir profil', user.id)}
            >
              Voir profil
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 
