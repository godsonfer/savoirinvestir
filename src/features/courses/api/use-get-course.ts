import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface useGetCourseIdProps {
  courseId: Id<"courses">;
}
export const useGetCourse = ({ courseId }: useGetCourseIdProps) => {
  const data = useQuery(api.courses.courseById, { courseId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
