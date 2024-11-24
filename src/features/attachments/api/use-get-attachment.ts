import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useGetAttachmentInterface {
  courseId: Id<"courses">;
  chapterId?: Id<"chapters">;
}
export const useGetAttachements = ({
  courseId,
  chapterId,
}: useGetAttachmentInterface) => {
  const data = useQuery(api.attachments.attachments, { courseId, chapterId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
