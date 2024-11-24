import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  name: string;
  description: string;
  workspaceId: Id<"workspaces">;
  visibility: "public" | "private";
  type: "audio" | "live" | "default" | "poll" | "post" | "board" | "course";
};
type ResponseType = Id<"channels"> | null;
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};
export const useCreateChannel = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSetteled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.channels.create);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      setData(null);
      setError(null);
      setStatus("pending");

      try {
        const response = await mutation(values);
        options?.onSuccess?.(response);
        setStatus("success");
        return response;
      } catch (error) {
        options?.onError?.(error as Error);
        setStatus("error");
        if (options.throwError) throw error;
      } finally {
        setStatus("settled");
        options.onSettled?.();
      }
    },
    [mutation],
  );
  return { mutate, data, error, isPending, isSetteled, isSuccess, isError };
};
