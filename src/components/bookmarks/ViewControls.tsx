/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid, List } from "lucide-react"
import { SortOption, ViewMode } from "@/types/course"

interface ViewControlsProps {
    sortBy: SortOption
    onSortChange: (value: SortOption) => void
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
}

export const ViewControls = ({ 
    sortBy, 
    onSortChange, 
    viewMode, 
    onViewModeChange 
}: ViewControlsProps) => {
    return (
        <div className="flex items-center gap-2 md:gap-3">
            {/* Tri */}
            {/* <div className="flex-1">
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="w-full text-sm md:text-base appearance-none px-3 py-2 rounded-lg 
                        bg-white/5 border border-white/10
                        text-gray-100 outline-none cursor-pointer transition-all
                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
                >
                    <option value="recent">Plus récents</option>
                    <option value="title">Alphabétique</option>
                    <option value="progress">Progression</option>
                    <option value="rating">Note</option>
                </select>
            </div> */}

            {/* Basculer la vue */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-1.5 md:p-2 rounded-md transition-all ${
                        viewMode === 'grid' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'text-gray-400 hover:bg-white/5'
                    }`}
                >
                    <Grid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-1.5 md:p-2 rounded-md transition-all ${
                        viewMode === 'list' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'text-gray-400 hover:bg-white/5'
                    }`}
                >
                    <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>
        </div>
    )
} 
