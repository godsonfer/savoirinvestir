interface BarChartProps {
    title: string
    data: {
        label: string
        values: number[]
        colors: string[]
    }[]
    categories: string[]
}

export const BarChart = ({ title, data, categories }: BarChartProps) => {
    const maxValue = Math.max(...data.flatMap(d => d.values))

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/60
            border border-gray-800/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">{title}</h3>
            
            <div className="space-y-6">
                {data.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400">
                                {item.label}
                            </span>
                            <span className="text-sm font-medium text-gray-300">
                                {item.values.reduce((a, b) => a + b, 0)}
                            </span>
                        </div>
                        <div className="flex gap-1 h-4">
                            {item.values.map((value, valueIndex) => (
                                <div
                                    key={valueIndex}
                                    className="relative group"
                                    style={{ width: `${(value / maxValue) * 100}%` }}
                                >
                                    <div
                                        className={`h-full rounded-full ${item.colors[valueIndex]} 
                                            relative overflow-hidden
                                            after:absolute after:inset-0 after:bg-gradient-to-r 
                                            after:from-white/20 after:via-white/0 after:to-transparent`}
                                    />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                        opacity-0 group-hover:opacity-100 transition-opacity
                                        pointer-events-none">
                                        <div className="bg-gray-900 text-gray-100 text-xs px-2 py-1 rounded">
                                            {categories[valueIndex]}: {value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 
