/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValue, useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


import { SaveIcon } from "lucide-react";

import { useCreateCourseModal } from "@/features/courses/store/create-course-modal";
import { useCreateCourse } from "@/features/courses/api/use-create-course";
import { useCreateCategory } from "@/features/categories/api/use-create-category";


interface CreateModalProps {
    variant: "course" | "category"
}
const FormSchema = z.object({
    title: z.string().min(3, {
        message: "Le titre doit avoir au moins 3 caractères.",
    }),
})
export const CreateModal = ({ variant }: CreateModalProps) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    })
    const router = useRouter()

    // const workspaceId = useWorkspaceId()

    const [open, setOpen] = useCreateCourseModal();
    const { mutate: createCourse, isPending: coursePending } = useCreateCourse()
    const { mutate: createCategory, isPending: categoryPending } = useCreateCategory()
    const [title, setTitle] = useState("");



    const handleClose = () => {
        setTitle("")
        setOpen(false)
    }
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        if (variant === "course") {
            createCourse({
                title: data.title
            }, {
                onSuccess(id) {
                    toast.success('Cours ajouté avec succès !')
                    router.push(`/dashboard/courses/${id}`)
                    setTitle("")
                    handleClose()
                },
                onError() {
                    data.title = ""
                    toast.error('Veuillez réessayer plus tard.')
                }
            })
        } else {
            createCategory({
                title: data.title
            }, {
                onSuccess(id) {
                    toast.success('Catégorie ajouté avec succès !')
                    setTitle("")
                    handleClose()
                },
                onError() {
                    data.title = ""
                    toast.error('Veuillez réessayer plus tard.')
                }
            })
        }
    }


    return (
        <Dialog open={open} onOpenChange={handleClose
        }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ajouter {variant === "course" ? "un cours" : "une categorie"}
                    </DialogTitle>
                    <DialogDescription>  Donnez un titre à votre {variant === "course" ? "cours" : "categorie"}. Vous pouvez le changer à tout moment.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input disabled={coursePending ||
                                            categoryPending} className="rounded-sm" placeholder="SMC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={coursePending || categoryPending} className="rounded-sm mt-3" variant={'orange'} type="submit"><SaveIcon /> Enregistrer </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
};
