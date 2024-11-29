import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetCategoryProp {
  categoryId: Id<"categories">;
}
export const useGetCategory = ({ categoryId }: useGetCategoryProp) => {
  const data = useQuery(api.categories.categoryById, { categoryId });
  const isLoading = data === undefined;
  return { data, isLoading };
};
