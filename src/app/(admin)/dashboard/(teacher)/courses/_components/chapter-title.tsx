"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Id } from "../../../../../../../convex/_generated/dataModel";
import { Pencil, Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useChapterTitle } from "@/features/chapters/api/use-update-chapter-title"

interface titleFormeProps {
    initialData: { title: string };
    chapterId: Id<"chapters">
}

const FormSchema = z.object({
    title: z.string().min(3, {
        message: "Le titre doit avoir au moins 3 caractères.",
    }),
})
export const ChapterTitleEditorForm = ({ initialData, chapterId }: titleFormeProps) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: initialData.title
        },
    })
    // const { isSubmiting, isValide } = form.formState;
    const [isEditing, setIsEditing] = useState(false)
    const { mutate, isPending } = useChapterTitle()
    function onSubmit(data: z.infer<typeof FormSchema>) {
        mutate({
            title: data.title,
            chapterId
        }, {
            onSuccess() {
                setIsEditing(false)
                toast.success('Modification du titre du chapitre terminée avec success!')
            },
            onError() {
                toast.error('Une erreur est survenue lors de la modification du titre du chapitre !')
            },
        })
    }

    return (
        <div >
            {!isEditing && (
                <div className=" bg-slate-100 rounded-md text-muted-foreground tex-xl">
                    <div className="flex font-medium items-center justify-between">
                        <Button variant={"transparent"} onClick={() => setIsEditing(true)}>
                            <Pencil className="ml-2 size-4" />
                        </Button>
                    </div>

                </div>)}
            {isEditing && (
                <div className="w-full rounded-sm shadow-sm ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full rounded-sm mt-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input disabled={isPending} placeholder="e.g : IMM Advanced .." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Renommer le chapitre
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2 mt-3 flex-1 items-end justify-end">
                                <Button disabled={isPending} onClick={() => setIsEditing(false)} variant={"outline"} > <X></X>Annuler</Button>
                                <Button disabled={isPending} variant={"orange"} type="submit"> <Save /> Sauver</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

        </div>

    )
}

