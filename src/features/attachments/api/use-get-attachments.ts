import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useGetCategories = () => {
  const data = useQuery(api.categories.categories);
  const isLoading = data === undefined;
  return { data, isLoading };
};
