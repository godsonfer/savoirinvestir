/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign, Gift, Loader, LogOut, Moon, Settings, Sun, } from 'lucide-react'

import React, { useState } from 'react'
import { useCurrentUser } from '../api/user-current-user'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { AvatarIcon } from '@radix-ui/react-icons'
import { SupportDialog } from '@/components/course-learning/SupportDialog'

const UserButton = () => {
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false)
  const openSupportDialog = () => {
    setIsSupportDialogOpen(true)
  }

  const { data, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }
  //chargement n case de chargement
  if (isLoading) { return (<Loader className='size-6 animate-spin text-muted-foreground' />) }
  // si aucune données, renvoi null
  if (!data) { return null }
  // traitement des données utilisateurs
  const { image, } = data


  return (
    <>
      <SupportDialog
        isOpen={isSupportDialogOpen}
        onClose={() => setIsSupportDialogOpen(false)}
      />
      <DropdownMenu modal={false} >
        <DropdownMenuTrigger className='outline-none relative dark:bg-black dark:text-white'>
          <Avatar className="rounded-md siez-10 hover:opacity-75 transition">
            <AvatarImage className='rounded-md' alt='name' src={image} />
            <AvatarFallback className='rounded-md bg-sky-500 text-white'>
              <AvatarIcon className='size-9' />
            </AvatarFallback>

          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center' side='bottom' className='w-60' >
          {/* <DropdownMenuItem onClick={toggleTheme}>
          {isDarkMode ? <Sun className='size-4 mr-2' /> : <Moon className='size-4 mr-2' />}
          {isDarkMode ? "Mode clair" : "Mode sombre"}
        </DropdownMenuItem> */}
          <DropdownMenuItem onClick={openSupportDialog}>
            <Gift className='size-4 mr-2' />
            Soutenir
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={openSupportDialog}>
            <DollarSign className='size-4 mr-2' />
            Service Premium
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className='size-4 mr-2' />
            Paramètres
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem onClick={() => handleSignOut()} className='h-10'>
            <LogOut className='size-4 mr-2' />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>

  )
}

export default UserButton
