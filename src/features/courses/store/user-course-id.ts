import { useQueryState } from "nuqs";

export const useCourseId = () => {
  return useQueryState("courseId");
};
