import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

/**
 * UseConfirm returns a component that renders a confirmation dialog and a function that returns a promise that resolves to true or false.
 * The promise is resolved to true if the user confirms the dialog and false if the user cancels the dialog.
 * The dialog is not rendered if the promise is null.
 * The dialog shows the title and message and two buttons, "Annuler" and "Confirmer".
 * When "Annuler" is clicked, the promise is resolved to false and the promise state is reset.
 * When "Confirmer" is clicked, the promise is resolved to true and the promise state is reset.
 * @param {string} title The title of the confirmation dialog.
 * @param {string} message The message of the confirmation dialog.
 * @returns A tuple of a function that returns a JSX element and a function that returns a promise.
 */
export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })
    /**
     * Reset the confirm promise to null, so it can be called again
     */
    const handleClose = () => {
        setPromise(null)
    }


    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    /**
     * Render a confirmation dialog based on the promise state.
     * If the promise is not null, the dialog is open and shows the title and message.
     * If the promise is null, the dialog is not rendered.
     * The dialog shows two buttons, "Annuler" and "Confirmer".
     * When "Annuler" is clicked, the promise is resolved to false and the promise state is reset.
     * When "Confirmer" is clicked, the promise is resolved to true and the promise state is reset.
     */
    const ConfirmDialog = () => {
        return (
            <Dialog open={promise !== null}>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button onClick={handleCancel} variant={"outline"}>Annuler</Button>
                        <Button onClick={handleConfirm} >Confirmer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        )
    }
    return [ConfirmDialog, confirm]
}
