import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useGetLessonsInterface {
  chapterId: Id<"chapters">;
}
export const useGetLessons = ({ chapterId }: useGetLessonsInterface) => {
  const data = useQuery(api.lessons.lessons, { chapterId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
