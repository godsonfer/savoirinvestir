import React from 'react'
import Link from 'next/link'
import { BookOpen, Users2, GraduationCap, MenuIcon, FileTextIcon, Search } from 'lucide-react'
import UserButton from '@/features/auth/components/user-button'

interface MobileNavigationProps {
  courseId?: string
  onOpenSidebar: () => void
  onOpenResources: () => void
  courseTitle?: string
}

export const MobileNavigation = ({
  onOpenSidebar,
  onOpenResources,
  courseTitle
}: MobileNavigationProps) => {
  return (
    <>
      {/* Barre supérieure pour la navigation du cours */}
      {
        courseTitle && (
          <div className="fixed top-0   left-0 right-0 h-12 bg-[#1a1b1a] border-b border-white/10 lg:hidden z-50">
            <div className="flex h-full items-center px-4 justify-between">
              <button
                onClick={onOpenSidebar}
                className="flex items-center justify-center w-10 h-10"
              >
                <MenuIcon className="w-5 h-5 text-white" />
              </button>

              <span className="text-white font-medium truncate mx-4">
                {courseTitle}
              </span>

              <button
                onClick={onOpenResources}
                className="flex items-center justify-center w-10 h-10"
              >
                <FileTextIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )
      }

      {/* Barre inférieure pour la navigation principale */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1b1a] border-t border-white/10 lg:hidden">
        <div className="flex h-full items-center justify-around">
          <Link href="/courses" className="flex flex-col items-center justify-center space-y-1">
            <Search className="w-5 h-5 text-white" />
            <span className="text-xs text-white">Explorer</span>
          </Link>
          <Link href="/bookmarks" className="flex flex-col items-center justify-center space-y-1">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="text-xs text-white">Mes Cours</span>
          </Link>

          <Link href="/exercices" className="flex flex-col items-center justify-center space-y-1">
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-xs text-white">Exercices</span>
          </Link>

          <Link href="/workspace" className="flex flex-col items-center justify-center space-y-1">
            <Users2 className="w-5 h-5 text-white" />
            <span className="text-xs text-white">Communauté</span>
          </Link>

          <div className="flex flex-col items-center justify-center space-y-1">
            <UserButton />
            <span className="text-xs text-white">Profil</span>
          </div>
        </div>
      </div>
    </>
  )
} 
