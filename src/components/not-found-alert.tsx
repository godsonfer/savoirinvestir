import { TriangleAlertIcon } from "lucide-react"

interface NotFoundAlertProps {
    message: string
}

export const NotFoundAlert = ({ message }: NotFoundAlertProps) => {
    return (
        <div className='h-full flex-1  flex   flex-col  gap-4  items-center justify-center'>
            <TriangleAlertIcon className='size-12 text-muted-foreground text-orange-400' />
            <span className="text-sm text-muted-foreground">
                {message}
            </span>
        </div>
    )
}
