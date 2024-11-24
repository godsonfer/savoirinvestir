import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetCourses = () => {
  const data = useQuery(api.courses.courses);
  const isLoading = data === undefined;
  return { data, isLoading };
};
