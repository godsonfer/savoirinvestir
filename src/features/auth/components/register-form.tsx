"use client"

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Lock, Mail, User, Phone, Camera } from 'lucide-react'
import { RegisterFormData, registerSchema } from '../schemas/auth.schema'
import { useAuthActions } from '@convex-dev/auth/react'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUploadThing } from "@/utils/uploadthing";

interface RegisterFormProps {
  onLoginClick: () => void
}

export const RegisterForm = ({ onLoginClick }: RegisterFormProps) => {
  const { signIn } = useAuthActions()
  const [showPassword, setShowPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const { startUpload } = useUploadThing("imageUploader");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        
        if (file.size > 1 * 1024 * 1024) {
          toast.error("L'image est trop volumineuse. Taille maximum : 1MB")
          setIsUploading(false)
          return
        }

        if (!file.type.startsWith('image/')) {
          toast.error("Le fichier doit être une image")
          setIsUploading(false)
          return
        }

        // Afficher la prévisualisation
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        // Upload sur UploadThing
        const res = await startUpload([file])
        
        if (res && res[0]) {
          setValue('avatar', res[0].url) // On stocke maintenant l'URL au lieu du fichier
        } else {
          toast.error("Erreur lors de l'upload de l'image")
        }
      } catch (error) {
        toast.error("Erreur lors du traitement de l'image")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
  
    try {
      await signIn('password', { 
        email: data.email, 
        password: data.password,
        name: data.fullName,
        phone: data.phone,
        image: data.avatar || '',
        flow: 'signUp' 
      })
      toast.success("Compte créé avec succès. Vous allez être redirigé vers votre espace.")
      window.location.href = '/courses'
    } catch (error) {
      toast.error("Quelque chose s'est mal passé lors de la création du compte")
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar>
            {avatarPreview ? (
              <AvatarImage 
                src={avatarPreview}
                alt="Avatar preview"
                className="h-24 w-24"
              />
            ) : (
              <AvatarFallback>
                <User className="h-24 w-24" />
              </AvatarFallback>
            )}
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full text-white hover:bg-cyan-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {errors.avatar && (
          <p className="text-sm text-red-500 mt-1">
            {errors.avatar.message as string}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Nom complet"
              className={`pl-10 h-12 bg-gray-50 border-gray-200 ${
                errors.fullName ? 'border-red-500 focus:border-red-500' : ''
              }`}
              {...register('fullName')}
            />
            <User className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
              errors.fullName ? 'text-red-500' : 'text-cyan-600'
            }`} />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500 ml-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type="email"
              placeholder="Adresse email"
              className={`pl-10 h-12 bg-gray-50 border-gray-200 ${
                errors.email ? 'border-red-500 focus:border-red-500' : ''
              }`}
              {...register('email')}
            />
            <Mail className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
              errors.email ? 'text-red-500' : 'text-cyan-600'
            }`} />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type="tel"
              placeholder="Numéro de téléphone"
              className={`pl-10 h-12 bg-gray-50 border-gray-200 ${
                errors.phone ? 'border-red-500 focus:border-red-500' : ''
              }`}
              {...register('phone')}
            />
            <Phone className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
              errors.phone ? 'text-red-500' : 'text-cyan-600'
            }`} />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 ml-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 ${
                errors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              {...register('password')}
            />
            <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
              errors.password ? 'text-red-500' : 'text-cyan-600'
            }`} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 ml-1">{errors.password.message}</p>
          )}
        </div>
      </div>

    

      <Button
        type="submit"
        className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white"
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting ? 'Création en cours...' : isUploading ? "Upload de l'image en cours..." : 'Créer mon compte apprenant'}
      </Button>

      <div className="text-center">
        <div className="text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    </motion.form>
  )
} 
