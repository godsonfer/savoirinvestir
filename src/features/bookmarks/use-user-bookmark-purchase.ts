import { api } from "../../../convex/_generated/api";
import { PaginatedQueryReference, usePaginatedQuery } from "convex/react";
const BATH_SIZE = 12;

export type getBookmarkPurchaseReturnType = (typeof api.bookmarks.getBookmarkPurchase._returnType)["page"];

export const useGetBookmarkPurchase = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.bookmarks.getBookmarkPurchase as unknown as PaginatedQueryReference,
    { paginationOpts: { numItems: BATH_SIZE, cursor: null } },
    { initialNumItems: BATH_SIZE }
  );
  return { results, status, loadMore: () => loadMore(BATH_SIZE) };
};
