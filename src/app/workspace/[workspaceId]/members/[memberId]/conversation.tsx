import { useMmeberId } from "@/hooks/use-member-id"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMember } from "@/features/members/api/use-get-member"
import { useGetMessages } from "@/features/messages/api/use-get-messages"
import { usePanel } from "@/hooks/use-panel"

import { SpinLoader } from "@/components/spin-loader"
import { MemberHeader } from "./member-header"
import { ChatInput } from "./chat-input"
import { MessageList } from "@/components/message-list"

interface ConversationProps {
    id: Id<"conversations">
}
export const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMmeberId()
    const { data: member, isLoading: MemberLoading } = useGetMember({ id: memberId })
    const { results, status, loadMore } = useGetMessages({ conversationId: id })
    const { onOpenProfile } = usePanel()

    if (MemberLoading || status === 'LoadingFirstPage') {
        return (
            <div className="h-full flex   items-center justify-center">
                <SpinLoader />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <MemberHeader onClick={() => onOpenProfile(memberId)} memberImage={member?.user?.image} memberName={member?.user?.name} />
            <MessageList
                data={results}
                variant="conversation"
                memberImage={member?.user?.image}
                memberName={member?.user?.name}
                loadMore={loadMore}
                isLoadingMore={status === 'LoadingMore'}
                canLoadMore={status === 'CanLoadMore'}
            />
            <ChatInput placeholder={`Ecrire un message privé à  ${member?.user?.name}`} conversationId={id} />
        </div>)
}
