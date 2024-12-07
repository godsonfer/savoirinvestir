import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
  title: string;
  difficulty: string | undefined;
  score: number | undefined;
  points: number | undefined;
  description: string | undefined;
  questions: Array<{
    questionId: string;
    question: string;
    points: number;
    category: string;
    hint: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string | undefined;
    }>;
  }>;
};
type ResponseType = Id<"exercices"> | null;
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

// export const useExercises = (
//   courseId?: Id<"courses">,
//   chapterId?: Id<"chapters">,
// ) => {
//   const exercises = useQuery(api.exercices.getExercises, {
//     courseId,
//     chapterId,
//   })

//   return {
//     exercises,
//     isLoading: exercises === undefined,
//   }
// }

// export const useExercise = (exerciseId: Id<"exercices">) => {
//   const exercise = useQuery(api.exercices.getExercise, {
//     exerciseId,
//   })

//   return {
//     exercise,
//     isLoading: exercise === undefined,
//   }
// }


export const useCreateExercice = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSetteled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.exercices.createExercise);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      setData(null);
      setError(null);
      setStatus("pending");

      try {
        console.log(values)
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


// export const useUpdateExercise = () => {
//   const updateExercise = useMutation(api.exercices.updateExercise)

//   const handleUpdate = async (exerciseId: Id<"exercices">, data: UpdateExerciseInput) => {
//     try {
//       const updatedId = await updateExercise({
//         exerciseId,
//         ...data,
//       })
//       return updatedId
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'exercice:", error)
//       throw error
//     }
//   }

//   return {
//     updateExercise: handleUpdate,
//   }
// }

// export const useDeleteExercise = () => {
//   const deleteExercise = useMutation(api.exercices.deleteExercise)

//   const handleDelete = async (exerciseId: Id<"exercices">) => {
//     try {
//       const deletedId = await deleteExercise({ exerciseId })
//       return deletedId
//     } catch (error) {
//       console.error("Erreur lors de la suppression de l'exercice:", error)
//       throw error
//     }
//   }

//   return {
//     deleteExercise: handleDelete,
//   }
// }

// export const usePublishExercise = () => {
//   const publishExercise = useMutation(api.exercices.publishExercise)

//   const handlePublish = async (exerciseId: Id<"exercices">, isPublished: boolean) => {
//     try {
//       const publishedId = await publishExercise({
//         exerciseId,
//         isPublished,
//       })
//       return publishedId
//     } catch (error) {
//       console.error("Erreur lors de la publication de l'exercice:", error)
//       throw error
//     }
//   }

//   return {
//     publishExercise: handlePublish,
//   }
// } 
