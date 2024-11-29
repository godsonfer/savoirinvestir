import { LucideIcon } from 'lucide-react'

interface CourseFeatureProps {
    Icon: LucideIcon
    text: string
    color?: string
}

export const CourseFeature = ({ Icon, text, color = '#0097A7' }: CourseFeatureProps) => (
    <div className="flex items-center gap-3 text-gray-600">
        <Icon className={`w-5 h-5 text-[${color}]`} />
        <span>{text}</span>
    </div>
) 
