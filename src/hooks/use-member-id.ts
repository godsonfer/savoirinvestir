import { Id } from "../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export const useMmeberId = () => {
  const param = useParams();
  return param.memberId as Id<"members">;
};
