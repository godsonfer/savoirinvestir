import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
}

export const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    trend
}: StatCardProps) => {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/60
            border border-gray-800/50 backdrop-blur-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-100">{value}</p>
                    {description && (
                        <p className="mt-1 text-sm text-gray-400">{description}</p>
                    )}
                    {trend && (
                        <p className={`mt-2 text-sm font-medium flex items-center gap-1
                            ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend.isPositive ? '↑' : '↓'} {trend.value}%
                            <span className="text-gray-400 text-xs">vs mois dernier</span>
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 via-[#178F65]/20 to-teal-500/20 
                    backdrop-blur-xl border border-emerald-500/10">
                    <Icon className="w-6 h-6 text-emerald-400" />
                </div>
            </div>
        </div>
    )
} 
