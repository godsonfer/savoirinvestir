import { Id } from "../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export const useLessonId = () => {
  const param = useParams();
  return param.lessonId as Id<"lessons">;
};
