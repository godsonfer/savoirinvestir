/* eslint-disable @typescript-eslint/no-unused-vars */
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"
import { useState } from "react";

import { getMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { Message } from "./message";

import { Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-get-current-member";
import { Loader } from "lucide-react";
import { ChannelHero } from "./channel-hero";
import { ConversationHero } from "@/components/conversation-hero";

const TIME_THRESHOLD = 5
interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCountMembers?: number
    channelDescription?: string;
    channelCreationTime?: number;
    variant?: 'channel' | 'thread' | 'conversation';
    data: getMessagesReturnType | undefined;
    loadMore: () => void
    isLoadingMore: boolean;
    canLoadMore: boolean;
}
const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Ajourd\'hui'
    if (isYesterday(date)) return 'Hier'
    return format(date, 'dd-MM-yyyy')
}
export const MessageList = ({
    memberName,
    memberImage,
    channelName,
    channelDescription,
    channelCreationTime,
    channelCountMembers,
    variant = 'channel',
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
}: MessageListProps) => {

    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useCurrentMember({ workspaceId })

    const groupedMessage = data?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, 'yyy-MM-dd')
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].unshift(message)
        return groups
    }, {} as Record<string, typeof data>);

    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
            {
                Object.entries(groupedMessage || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-200" />
                            <span className="relative inline-block bg-white  px-4 py-1 rounded-full text-xs border border-gray-300 shadow-md">{formatDateLabel(dateKey)}</span>
                        </div>

                        {
                            messages.map((message, index,) => {
                                const previewMessage = messages[index - 1];
                                const isCompact =
                                    previewMessage &&
                                    previewMessage.user?._id === message.user?._id &&
                                    differenceInMinutes(
                                        new Date(message._creationTime),
                                        new Date(previewMessage._creationTime)) < TIME_THRESHOLD;
                                return (
                                    <Message
                                        key={message._id}
                                        id={message._id}
                                        memberId={message.memberId}
                                        authorImages={message.user.image}
                                        authorName={message.user.name}
                                        isAuthor={message.memberId === currentMember?._id}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                        isCompact={isCompact}
                                        reactions={message.reactions}
                                        body={message.body}
                                        file={message.file}
                                        updatedAt={message.updatedAt}
                                        createdAt={message._creationTime}
                                        hideThreadButton={variant === 'thread'}
                                        threadCount={message.threadCount}
                                        threadImage={message.threadImage}
                                        threadTimestamp={message.threadTimestamp}
                                        threadName={message.threadName}
                                    />
                                )
                            })
                        }

                    </div>
                ))
            }
            <div className="h-1" ref={(el) => {
                if (el) {
                    const observer = new IntersectionObserver(([entry]) => {
                        if (entry.isIntersecting && canLoadMore) {
                            loadMore()
                        }
                    }, { threshold: 1.0 });
                    observer.observe(el)
                    return () => observer.disconnect()
                }
            }} />

            {isLoadingMore && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-200" />
                    <span className="relative inline-block bg-white  px-4 py-1 rounded-full text-xs border border-gray-300 shadow-md">
                        <Loader className="animate-spin size-4" />
                    </span>
                </div>
            )}

            {variant === "channel" && channelName && channelCreationTime && (
                <ChannelHero
                    name={channelName}
                    creationTime={channelCreationTime}
                    description={channelDescription}
                    members={0}
                />
            )}
            {variant === "conversation" && memberName && (
                <ConversationHero
                    name={memberName}
                    memberImage={memberImage}
                />
            )}
        </div>)
}
