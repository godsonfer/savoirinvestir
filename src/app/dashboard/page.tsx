/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { useState } from "react"
import { CreateModal } from "./_components/create-modal"
import { useCreateCourseModal } from "@/features/courses/store/create-course-modal"
import { Plus } from "lucide-react"

const DashboardPage = () => {
    const [_isOpen, setIsOpen] = useCreateCourseModal()
    const [variant, setVariant] = useState<"course" | "category">('course')
    const changeVariant = (variant: "course" | "category") => {
        setIsOpen(true)
        setVariant(variant)
    }
    return (
        <div className='p-6'>
            <CreateModal variant={variant} />
            <div className="flex justify-end items-end gap-2">
                <Button onClick={() => changeVariant('course')} variant={"orange"}><Plus />  Formation</Button>
                <Button onClick={() => changeVariant('category')} variant={"orange"}> <Plus /> Categorie</Button>
            </div>
        </div>

    )
}

export default DashboardPage
