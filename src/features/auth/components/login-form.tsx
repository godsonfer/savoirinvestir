"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { LoginFormData, loginSchema } from '../schemas/auth.schema'
import { useAuthActions } from '@convex-dev/auth/react'
import { toast } from 'sonner'

interface LoginFormProps {
  onRegisterClick: () => void
  onForgotPasswordClick: () => void
}

export const LoginForm = ({ onRegisterClick, onForgotPasswordClick }: LoginFormProps) => {
    const { signIn } = useAuthActions()
    const [showPassword, setShowPassword] = useState(false)
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn('password', { 
        email: data.email, 
        password: data.password, 
        flow: 'signIn' 
      })
      toast.success("Connexion réussie. Vous allez être redirigé vers votre espace.")
      window.location.href = '/courses'
    } catch (error) {
      toast.error("Quelque chose s'est mal passé")
      console.error(error)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
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
        className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Connexion en cours...' : 'Accéder à mes formations'}
      </Button>

      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-sm text-cyan-600 hover:text-cyan-700"
        >
          Mot de passe oublié ?
        </button>
        <div className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Commencer à apprendre
          </button>
        </div>
      </div>
    </motion.form>
  )
} 
