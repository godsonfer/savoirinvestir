import { Id } from "./../../convex/_generated/dataModel.d";
import { useParams } from "next/navigation";

export const useCourseId = () => {
  const param = useParams();
  return param.courseId as Id<"courses">;
};
