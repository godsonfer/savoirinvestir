import { Id } from "./../../convex/_generated/dataModel.d";
import { useParams } from "next/navigation";

export const useChannelId = () => {
  const param = useParams();
  return param.channelId as Id<"channels">;
};
