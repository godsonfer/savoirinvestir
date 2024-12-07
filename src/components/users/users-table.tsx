/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Download, Mail, Phone, Calendar, CircleDot, Star, Shield } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { format } from "date-fns"
import { User } from "@/types/users"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function UsersTable({ 
  users,
  onSort,
  sortField,
  sortOrder,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange
}: {
  users: User[]
  onSort: (field: string) => void
  sortField: string
  sortOrder: string
  currentPage: number
  itemsPerPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Liste des Utilisateurs</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <div className="overflow-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Inscription & Activité</TableHead>
                  <TableHead>Abonnement</TableHead>
                  <TableHead className="sticky right-0 bg-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <Dialog key={user.id}>
                    <TableRow className="hover:bg-gray-50/50">
                      <DialogTrigger asChild>
                        <TableCell className="cursor-pointer">
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
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Inscrit le: {format(user.registeredAt, 'dd/MM/yyyy')}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Dernière connexion: {format(user.lastLogin, 'dd/MM/yyyy')}
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
                            <span>Expire le: {format(user.subscription.validUntil, 'dd/MM/yyyy')}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-2">
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Détails</Button>
                          </DialogTrigger>
                          <Button variant="outline" size="sm">Éditer</Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>Détails de l&apos;utilisateur</DialogTitle>
                      </DialogHeader>
                      {/* <UserDetails user={user} /> */}
                    </DialogContent>
                  </Dialog>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
} 
