import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface useGetMessageProps {
    messageId: Id<"messages">;
}
export const useGetMessage = ({ messageId }: useGetMessageProps) => {
    const data = useQuery(api.messages.getById, { messageId });
    const isLoading = data === undefined;
    return { data, isLoading };
};
