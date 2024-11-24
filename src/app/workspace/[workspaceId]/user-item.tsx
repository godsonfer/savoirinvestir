import { Id } from '../../../../convex/_generated/dataModel';
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, } from '@/lib/utils';
import React from 'react'

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4  mt-0.5 mb-3 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#085867] hover:text-[#085867]  font-bold   hover:bg-[#085867]/10  ",
        active: "text-white bg-[#085867]/90 hover:bg-[#085867]/90 ",
      },
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({ id, label = "Membres", image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId()
  const avataFallback = label.charAt(0).toUpperCase()
  return (
    <Button variant={"transparent"} className={cn(userItemVariants({ variant: variant }))} size={"sm"} asChild>
      <Link href={`/workspace/${workspaceId}/members/${id}`}>
        <Avatar >
          <AvatarImage src={image} alt="image" />
          <AvatarFallback >
            {avataFallback}
          </AvatarFallback>
        </Avatar>
        <span className='text-sm truncate'>
          {label}
        </span>
      </Link>

    </Button>
  )
}

