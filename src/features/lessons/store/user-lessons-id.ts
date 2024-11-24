import { useQueryState } from "nuqs";

export const useLessonId = () => {
  return useQueryState("lessonId");
};
