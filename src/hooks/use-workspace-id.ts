import { Id } from "./../../convex/_generated/dataModel.d";
import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
  const param = useParams();
  return param.workspaceId as Id<"workspaces">;
};
