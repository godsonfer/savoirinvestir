import { AlertTriangle } from "lucide-react"

interface AlertProps {
    label: string
    variant?: string | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | 'dark-alt',
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
}
export const Alert = ({ label, variant, size }: AlertProps) => {
    return (
        <div className="h-full flex flex-col gap-2   items-center justify-center">
            <AlertTriangle className={`${size ? `size-${size}` : 'size-5'}  ${variant ? `text-${variant}-foreground` : 'text-muted-foreground'}`} />
            <span>
                {label}
            </span>
        </div>
    )
}
