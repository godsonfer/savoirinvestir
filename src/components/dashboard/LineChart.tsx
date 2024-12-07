interface LineChartProps {
    title: string
    data: {
        label: string
        values: number[]
        color: string
    }[]
    labels: string[]
}

export const LineChart = ({ title, data, labels }: LineChartProps) => {
    const maxValue = Math.max(...data.flatMap(d => d.values))
    const minValue = Math.min(...data.flatMap(d => d.values))
    const range = maxValue - minValue

    const getY = (value: number) => {
        return 100 - ((value - minValue) / range) * 100
    }

    const getPoints = (values: number[]) => {
        const width = 100 / (values.length - 1)
        return values
            .map((value, index) => `${index * width},${getY(value)}`)
            .join(' ')
    }

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/60
            border border-gray-800/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">{title}</h3>
            
            <div className="relative h-64">
                {/* Grille */}
                <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-gray-800/50" />
                    ))}
                </div>

                {/* Graphique */}
                <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {data.map((item, index) => (
                            <g key={index}>
                                {/* Ligne */}
                                <polyline
                                    points={getPoints(item.values)}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="2"
                                    className="drop-shadow-lg"
                                />
                                {/* Points */}
                                {item.values.map((value, valueIndex) => {
                                    const x = (valueIndex / (item.values.length - 1)) * 100
                                    const y = getY(value)
                                    return (
                                        <g key={valueIndex} className="group">
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r="3"
                                                fill={item.color}
                                                className="drop-shadow"
                                            />
                                            {/* Tooltip */}
                                            <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <rect
                                                    x={x - 20}
                                                    y={y - 25}
                                                    width="40"
                                                    height="20"
                                                    rx="4"
                                                    fill="#111827"
                                                />
                                                <text
                                                    x={x}
                                                    y={y - 12}
                                                    textAnchor="middle"
                                                    fill="#D1D5DB"
                                                    fontSize="10"
                                                >
                                                    {value}
                                                </text>
                                            </g>
                                        </g>
                                    )
                                })}
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Labels */}
                <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-400
                    transform translate-y-6">
                    {labels.map((label, index) => (
                        <span key={index}>{label}</span>
                    ))}
                </div>
            </div>

            {/* Légende */}
            <div className="mt-8 flex items-center gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
} 
