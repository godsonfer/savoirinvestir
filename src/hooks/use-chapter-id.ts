import { Id } from "../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export const useChapterId = () => {
  const param = useParams();
  return param.chapterId as Id<"chapters">;
};
