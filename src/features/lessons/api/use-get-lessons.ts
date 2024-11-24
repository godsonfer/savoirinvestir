import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useGetLessonsInterface {
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
}
export const useGetLessons = ({
  courseId,
  chapterId,
}: useGetLessonsInterface) => {
  const data = useQuery(api.lessons.lessons, { courseId, chapterId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
