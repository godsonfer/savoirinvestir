/* eslint-disable @typescript-eslint/no-unused-vars */
import { MdOutlineAddReaction } from 'react-icons/md'
import React from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel'
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-get-current-member';
import { cn } from '@/lib/utils';
import { Button } from './components/ui/button';
import { Hint } from './ui/hint';
import { EmojiPopover } from './emoji-popover';

interface ReactionProps {
    data: Array<Omit<Doc<"reactions">, 'memberId'> & {
        count: number;
        memberIds: Id<"members">[]
    }>,
    authorName?: string,
    onChange: (value: string) => void
}

export const Reactions = ({ data, authorName, onChange }: ReactionProps) => {
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useCurrentMember({ workspaceId })
    const currentMemberId = currentMember?._id

    if (data.length === 0 || !currentMemberId) { return null }

    return (
        <div className='flex items-center gap-1 mb-1'>
            {
                data.map((reaction) => (
                    <Hint key={reaction.value} label={`${reaction.count} ${reaction.count === 1 ? 'membre a' : 'membres ont'}  réagis par ${reaction.value}`}>
                        <button onClick={() => onChange(reaction.value)}
                            className={cn('h-6  px-2  rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center justify-center gap-x-1 ',
                                reaction.memberIds.includes(currentMemberId) && 'bg-blue-100/70 border-blue-500 text-white'
                            )}>
                            {reaction.value}
                            <span className={cn('text-xs font-semibold to-muted-foreground',
                                reaction.memberIds.includes(currentMemberId) && 'text-blue-500')}>
                                {reaction.count}
                            </span>
                        </button>
                    </Hint>
                ))
            }
            <EmojiPopover hint='Ajout de réaction' onEmojiSelect={(emoji) => onChange(emoji)}>
                <button className='h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 items-center gap-y-1'>
                    <MdOutlineAddReaction className='size-4' />
                </button>
            </EmojiPopover>
        </div>
    )
}
