interface ProgressIndicatorProps {
    completed: number;
    total: number;
}

export const ProgressIndicator = ({
    completed,
    total
}: ProgressIndicatorProps) => {
    const percentage = (completed / total) * 100;

    return (
        <div className="w-full">
            <div className="flex items-center gap-x-2 mb-2">
                <span className="text-sm font-medium">{completed}/{total} complétés</span>
                <span className="text-sm text-muted-foreground">({percentage.toFixed(0)}%)</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
                <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}; 
