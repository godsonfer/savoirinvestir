import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useGetCapterInterface {
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
}
export const useGetChapter = ({
  courseId,
  chapterId,
}: useGetCapterInterface) => {
  const data = useQuery(api.chapters.chapterById, { chapterId, courseId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
