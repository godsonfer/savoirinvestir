import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATH_SIZE = 20
interface useGetMessagesProps {
    channelId?: Id<"channels">
    conversationId?: Id<"conversations">
    parentMessageId?: Id<"messages">
}

export type getMessagesReturnType = typeof api.messages.get._returnType["page"]

/**
 * Custom hook to fetch paginated messages from a specified channel, conversation, or parent message.
 *
 * @param {Object} props - The properties to filter messages.
 * @param {Id<"channels">} [props.channelId] - The ID of the channel to fetch messages from.
 * @param {Id<"conversations">} [props.conversationId] - The ID of the conversation to fetch messages from.
 * @param {Id<"messages">} [props.parentMessageId] - The ID of the parent message to fetch replies from.
 * 
 * @returns {Object} An object containing:
 * - `results`: The fetched messages.
 * - `status`: The status of the query.
 * - `loadMore`: A function to load more messages.
 */
export const useGetMessages = ({
    channelId, conversationId, parentMessageId,
}: useGetMessagesProps) => {
    const { results, status, loadMore } = usePaginatedQuery(api.messages.get, {
        channelId,
        conversationId,
        parentMessageId,
    }, { initialNumItems: BATH_SIZE, });
    return { results, status, loadMore: () => loadMore(BATH_SIZE) };
}
