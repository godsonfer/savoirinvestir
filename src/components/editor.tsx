/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Quill, { type QuillOptions } from "quill"
import { Delta, Op } from "quill/core"
import "quill/dist/quill.snow.css"

import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Hint } from "./ui/hint"
import { EmojiPopover } from "./emoji-popover"
import { PiTextAa } from "react-icons/pi"
import { ImageIcon, SendHorizonal, Smile, XIcon } from "lucide-react"
type EditorValues = {
    image: File | null;
    body: string
}
interface EditorProp {
    variant?: 'create' | 'update';
    onSubmit: ({ image, body }: EditorValues) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    diseable?: boolean;
    innerRef?: MutableRefObject<Quill | null>
}
const Editor = ({
    variant = "create",
    onSubmit, onCancel,
    placeholder = "Écrivez votre message...",
    defaultValue = [], innerRef, diseable = false }: EditorProp) => {
    const [text, setText] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [isToolbarVisible, setIsToolbarVisible] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const diseableRef = useRef(diseable)
    const imageElementRef = useRef<HTMLInputElement>(null)
    useLayoutEffect(() => {
        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        diseableRef.current = diseable
    })

    useEffect(() => {
        if (!containerRef.current) return
        const container = containerRef.current
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'),)
        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    ['clean']
                ],
                keyboard: {
                    bindings: {
                        shift_enter: {
                            key: "Enter",
                            handler: () => {
                                const text = quill.getText()
                                const addedImage = imageElementRef.current?.files?.[0] || null
                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0
                                if (isEmpty) return
                                const body = JSON.stringify(quill.getContents())
                                submitRef.current?.({ body, image: addedImage })
                            }
                        },
                        enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, '\n')
                            }
                        }
                    }
                }
            }
        }
        const quill = new Quill(editorContainer, options)
        quillRef.current = quill
        quillRef.current.focus()
        if (innerRef) {
            innerRef.current = quill
        }
        quill.setContents(defaultValueRef.current)
        setText(quill.getText())

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText())
        })
        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if (container) {
                container.innerHTML = ""
            }
            if (quillRef.current) {
                quillRef.current = null
            }
            if (innerRef) {
                innerRef.current = null
            }
        }
    }, [innerRef])

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0

    const toolbarVisible = () => {
        setIsToolbarVisible((current) => !current)
        const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')
        if (toolbarElement) {
            toolbarElement.classList.toggle('hidden')
        }
    }
    const onEmojiSelect = (emojiValue: string) => {
        const quill = quillRef.current;
        quill?.insertText(quill?.getSelection()?.index || 0, emojiValue)
    }
    return (
        <div className="flex flex-col">
            <input
                className='hidden'
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(e) => setImage(e.target.files![0])}
            />

            <div className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden forcus-within:border-slate-300 forcus-within:shadow-sm  transition bg-white", diseable && "opacity-50")} >
                <div ref={containerRef} className="h-full  ql-custom" />
                {
                    !!image && (
                        <div className="p-2">
                            <div className="relative size-[62px] flex items-center justify-center group/image">
                                <Hint label="Retirer le fichier">
                                    <button
                                        className="hidden group-hover/image:flex rounded-full
                                          bg-gray-600/70 hover:bg-gray-600 p-1.5 absolute -top-2.5 -right-2.5
                                           text-white size-6 z-[4]  border-2 border-white items-center justify-center"
                                        onClick={() => {
                                            setImage(null); imageElementRef.current!.value = "";
                                        }}
                                    >
                                        <XIcon className="size-3.5" />
                                    </button>
                                </Hint>
                                <Image src={URL.createObjectURL(image)} alt="image" fill className="rounded-xl overflow-hidden  border  object-cover" />
                            </div>
                        </div>)
                }

                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={!isToolbarVisible ? "Caché le formatage" : "Afficher formatage"}>
                        <Button disabled={diseable || isEmpty} variant="ghost" size={"iconSm"} onClick={toolbarVisible}>
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button disabled={diseable} variant="ghost" size={"iconSm"} >
                            <Smile className="size-4" />
                        </Button>
                    </EmojiPopover>
                    {variant === "create" && (
                        <Hint label="Image">
                            <Button disabled={diseable} variant="ghost" size={"iconSm"} onClick={() => imageElementRef.current?.click()}>
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}
                    {variant === "update" && (
                        <div className="flex ml-auto items-center gap-x-2">
                            <Hint label="Annuler ">
                                <Button variant={'outline'} size={"sm"} disabled={diseable || isEmpty || isEmpty} onClick={onCancel}>
                                    Annuler
                                </Button>
                            </Hint>
                            <Hint label="Modifier ">
                                <Button className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white " size={"sm"}
                                    disabled={diseable || isEmpty}
                                    onClick={() => {
                                        onSubmit({
                                            body: JSON.stringify(quillRef.current?.getContents()),
                                            image
                                        })
                                    }}
                                >
                                    Enregistrer
                                </Button>
                            </Hint>
                        </div>

                    )}

                    {variant === "create" && (
                        <Hint label="Envoyer ">
                            <Button className={cn("ml-auto", isEmpty ?
                                " bg-white hover:bg-white/80 text-slate-900 bg-muted-foreground" :
                                " bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                            )} disabled={diseable || isEmpty} size={"iconSm"} onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image
                                })
                            }}>
                                <SendHorizonal className="size-4" />
                            </Button>
                        </Hint>
                    )}

                </div>
            </div>
            {variant === "create" && (
                <div className={cn("ml-auto justify-end flex text-[10px] p-2  text-xs text-muted-foreground opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <strong>Shift  + Entrée </strong> pour ajouté une nouvelle ligne
                </div>
            )}

        </div>
    )
}

export default Editor
