import { api } from "../../../../convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
const BATH_SIZE = 6;

export type getCoursesReturnType = (typeof api.courses.get._returnType)["page"];

export const useGetCourses = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.courses.get,
    {},
    { initialNumItems: BATH_SIZE }
  );
  return { results, status, loadMore: () => loadMore(BATH_SIZE) };
};
