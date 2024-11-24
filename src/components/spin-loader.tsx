import { Loader } from "lucide-react";

interface loaderSpinProps {
    size?: string
    text?: string
}
export const SpinLoader = ({ size = "size-5", text = "text-muted-foreground" }: loaderSpinProps) => {
    return (
        <div className="items-center justify-center h-full w-full flex flex-col">
            <Loader className={`${size} animate-spin ${text} `} />
        </div>)
}
