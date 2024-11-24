/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
// TODO:: add author, message, date, dowload, options on hover
interface ThumbnailProps {
    url: string | null | undefined
}
export const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url) return null
    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
                    <img src={url} className="rounded-md object-cover size-full" alt="Fichier" />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[1200px] border-none bg-transparent p-0 shadow-none">
                <img src={url} className="rounded-md object-cover size-full" alt="Fichier" />
            </DialogContent>
        </Dialog>
    )
}
