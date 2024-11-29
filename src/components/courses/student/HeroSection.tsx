import Image from 'next/image'
import { Course } from '@/types/course'

interface HeroSectionProps {
    course: Course
}

export const HeroSection = ({ course }: HeroSectionProps) => (
    <div className="absolute inset-0 overflow-hidden group">
        {course?.cover && (
            <>
                <Image
                    src={course.cover}
                    alt={course.title}
                    fill
                    priority
                    className="object-cover filter brightness-[0.3] group-hover:brightness-[0.4] transition-all duration-700 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0097A7]/30 via-black/50 to-black/80" />
                <div 
                    className="absolute inset-0 opacity-10" 
                    style={{ 
                        backgroundImage: 'url(/grid.svg)',
                        backgroundRepeat: 'repeat'
                    }} 
                />
            </>
        )}
    </div>
) 
