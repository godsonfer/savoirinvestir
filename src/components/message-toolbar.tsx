/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import { MessageCircle, Pencil, Smile, Trash2 } from 'lucide-react';
import { Hint } from './ui/hint';
import { EmojiPopover } from './emoji-popover';
import { Button } from './ui/button';
// TODO : Ajout de Transfert, Enregistrer pour plus tard, option
interface MessageToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (emoji: string) => void
    hideThreadButton?: boolean;
}

export const MessageToolbar = (
    ({ isAuthor,
        isPending,
        handleEdit,
        handleReaction,
        handleThread,
        handleDelete,
        hideThreadButton
    }: MessageToolbarProps
    ) => {
        return (
            <div className='absolute top-0 right-12'>
                <div className="group-hover:opacity-100 opacity-0 transition-opacity bg-[#edff] bordere rounded-full shadow-sm">
                    <EmojiPopover
                        hint='Réactions'
                        onEmojiSelect={(emoji) => handleReaction(emoji)}
                    >
                        <Button className='rounded-none' variant={"ghost"} size={"icon"} disabled={isPending}>
                            <Smile className='size-4' />
                        </Button>
                    </EmojiPopover>
                    {
                        !hideThreadButton && (
                            <Hint label='Répondre'>
                                <Button onClick={handleThread} className='rounded-none' variant={"ghost"} size={"icon"} disabled={isPending}>
                                    <MessageCircle className='size-4' />
                                </Button>
                            </Hint>
                        )
                    }
                    {isAuthor && <Hint label='Modifier'>
                        <Button onClick={handleEdit} className='rounded-none' variant={"ghost"} size={"icon"} disabled={isPending}>
                            <Pencil className='size-4' />
                        </Button>
                    </Hint>
                    }
                    {isAuthor && <Hint label='Supprimer'>
                        <Button onClick={handleDelete} className='rounded-none' variant={"ghost"} size={"icon"} disabled={isPending}>
                            <Trash2 className='size-4' />
                        </Button>
                    </Hint>
                    }


                </div>
            </div>
        )
    }
)
