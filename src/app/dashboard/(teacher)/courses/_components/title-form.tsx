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


import { Id } from "../../../../../../convex/_generated/dataModel";
import { Pencil, Save, X } from "lucide-react"
import { useState } from "react"
import { useUpdateCourseTitle } from "@/features/courses/api/use-update-course-title"
import { toast } from "sonner"

interface titleFormeProps {
    initialData: { title: string };
    courseId: Id<"courses">
}

const FormSchema = z.object({
    title: z.string().min(3, {
        message: "Le titre doit avoir au moins 3 caractères.",
    }),
})
export const TitleForm = ({ initialData, courseId }: titleFormeProps) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: initialData.title
        },
    })
    // const { isSubmiting, isValide } = form.formState;
    const [isEditing, setIsEditing] = useState(false)
    const { mutate, isPending } = useUpdateCourseTitle()
    function onSubmit(data: z.infer<typeof FormSchema>) {
        mutate({
            title: data.title,
            courseId
        }, {
            onSuccess() {
                setIsEditing(false)
                toast.success('Modification du titre de la formation terminée avec success!')
            },
            onError() {
                toast.error('Une erreur est survenue lors de la modification du titre de la formation !')
            },
        })
    }

    return (
        <div >
            {!isEditing && (
                <div className="mt-2 bg-slate-100 p-2 rounded-md text-muted-foreground tex-xl">
                    <div className="flex font-medium items-center justify-between">
                        {initialData.title}
                        <Button variant={"transparent"} onClick={() => setIsEditing(true)}>
                            <Pencil className="ml-2 size-4" />
                        </Button>
                    </div>

                </div>)}
            {isEditing && (
                <div className=" p-2 rounded-sm shadow-sm ">
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
                                            Renommer la formation
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

