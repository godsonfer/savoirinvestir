import { api } from "../../../../convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
const BATH_SIZE = 20;

export type getCoursesReturnType = (typeof api.courses.getHomeCourses._returnType)["page"];

export const useGetHomeCourses = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.courses.getHomeCourses,
    {},
    { initialNumItems: BATH_SIZE }
  );
  return { results, status, loadMore: () => loadMore(BATH_SIZE) };
};
