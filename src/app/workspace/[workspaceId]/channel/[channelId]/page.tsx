'use client'
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useChannelId } from '@/hooks/use-channel-id'
import { useGetMessages } from '@/features/messages/api/use-get-messages'

import { Loader, MoreVerticalIcon, AlertTriangle as TriangleAlertIcon } from 'lucide-react'
import React from 'react'

import { ChannelHeader } from './channel-header'
import { ChatInput } from './chat-input'
import { MessageList } from '@/components/message-list'

const ChannelIdPage = () => {
    const channelId = useChannelId()
    const { data: channel, isLoading: channelLoading } = useGetChannel({ channelId })
    const { results: messages, status, loadMore } = useGetMessages({ channelId: channelId, })
    
    if (channelLoading || status === "LoadingFirstPage") {
        return (
            <div className='h-full flex flex-1 items-center justify-center'>
                <Loader className='animate-spin size-6  text-muted-foreground' />
            </div>
        )
    }
    
    if (!channel) {
        return (
            <div className='h-full flex-1 flex flex-col gap-4 items-center justify-center'>
                <TriangleAlertIcon className='size-12 text-muted-foreground text-orange-400' />
                <span className="text-sm text-muted-foreground">
                    Salon de discussion introuvable ou inaccessible
                </span>
            </div>
        )
    }
    
    return (
        <div className='flex flex-col h-full'>
            <div className='flex justify-between items-center border-b'>
                <ChannelHeader title={channel?.name} description={channel?.description} />
                <div className="flex gap-2 py-2 mr-4">
                    <p>Plusieurs</p>
                    <MoreVerticalIcon className='mr-3 size-4' />
                </div>
            </div>
            <MessageList
                channelName={channel?.name}
                channelCreationTime={channel?._creationTime}
                isLoadingMore={status === "LoadingMore"}
                data={messages}
                loadMore={loadMore}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`Message #${channel?.name}`} />
        </div>
    )
}

export default ChannelIdPage
