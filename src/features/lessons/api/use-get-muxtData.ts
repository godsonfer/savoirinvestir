import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useLessonInterface {
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
  lessonId: Id<"lessons">;
}
export const useGetMuxtData = ({
  courseId,
  chapterId,
  lessonId,
}: useLessonInterface) => {
  const data = useQuery(api.lessons.muxtData, {
    lessonId,
    courseId,
    chapterId,
  });
  const isLoading = data === undefined;
  return { data, isLoading };
};
