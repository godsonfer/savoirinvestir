import React from 'react'
import Link from 'next/link'
import { BookOpen, Users2, GraduationCap, MenuIcon, FileTextIcon, Search, } from 'lucide-react'
import UserButton from '@/features/auth/components/user-button'
import { Id } from '../../../convex/_generated/dataModel'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { MdChat } from 'react-icons/md'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { SidebarButton } from '@/app/workspace/[workspaceId]/sidebar-button'

interface MobileNavigationProps {
  courseId?: Id<"courses">
  onOpenSidebar: () => void
  onOpenResources: () => void
  courseTitle?: string
  isWorkspace? :boolean
  isCourseLecuture ?: boolean
}

export const MobileNavigation = ({
  onOpenSidebar,
  onOpenResources,
  courseTitle, 
  isWorkspace, 
  isCourseLecuture
}: MobileNavigationProps) => {
  const pathname = usePathname()
  return (
    <>
      {/* Barre supérieure pour la navigation du cours */}
      {
        courseTitle && (
          <div className="fixed top-0 w-full  left-0 right-0 h-12 bg-[#1a1b1a] rounded-b-md border-b border-white/10 lg:hidden z-50">
             {
              isWorkspace && (
                <div className="flex flex-1  h-full items-center justify-between px-4">
                  
                    <Button variant={'transparent'} className='rounded-lg bg-white/20 hover:bg-slate-50/10 transition-colors'>    
                      <MdChat className="w-5 h-5 text-gray-500" />
                     </Button>
                    {/* <span className="text-xs text-gray-500 text-bolder">{courseTitle}</span> */}
                    <div className="flex flex-col items-end justify-end space-y-1">
                     <Button variant={'transparent'}  className='rounded-lg  hover:bg-slate-50/10 transition-colors'>
                      <DotsHorizontalIcon className="w-5 h-5 text-gray-500" />
                     </Button>
                    </div>
                </div>
              )
             }
{/* lecture des cours */}
             {isCourseLecuture && (
               <>
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
               </>
             )}
          
          </div>
        )
      }

      {/* Barre inférieure pour la navigation principale */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1b1a] border-t border-white/10 lg:hidden">
        <div className="flex h-full items-center justify-around hover:translate-y-[-2px] mb-4">
          <SidebarButton href='/courses' icon={Search} label='Explorer' isActive={pathname.includes('/courses')} />
          <SidebarButton href='/courses' icon={GraduationCap} label='Mes Cours' isActive={pathname.includes('/bookmarks')} />
          <SidebarButton href='/exercices' icon={BookOpen} label='Exercices' isActive={pathname.includes('/exercices')} />
          <SidebarButton href='/workspace' icon={Users2} label='Communauté' isActive={pathname.includes('/workspace')} />
          <div className="flex flex-col items-center justify-center">
            <UserButton  />
            <span className="text-[12px] text-white font-bold  justify-center group-hover:text-accent">Profile</span>
          </div>
        </div>
      </div>
    </>
  )
} 
