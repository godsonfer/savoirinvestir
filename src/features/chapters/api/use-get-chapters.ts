import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface useGetCapterInterface {
  courseId: Id<"courses">;
}
export const useGetChapters = ({ courseId }: useGetCapterInterface) => {
  const data = useQuery(api.chapters.chapters, { courseId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
