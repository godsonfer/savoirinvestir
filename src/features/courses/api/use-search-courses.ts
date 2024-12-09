import { useQuery } from "convex/react"
import { useDebounce } from "@/hooks/use-debounce"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"

type SearchResult = NonNullable<(typeof api.courses.get._returnType)["page"][number]>;

export const useSearchCourses = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 1000)

    const searchResults = useQuery(
        api.courses.get,
        debouncedSearch.length >= 2 ? { 
            paginationOpts: {
                numItems: 10,
                cursor: null
            }
        } : "skip"
    )

    const filteredResults = searchResults?.page
        .filter((course): course is SearchResult => course !== null)
        .filter(course => 
            course.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
        )
    return {
        searchQuery,
        setSearchQuery,
        searchResults: filteredResults ?? null,
        isLoading: searchResults === undefined,
        isSearching: debouncedSearch.length > 0
    }
} 
