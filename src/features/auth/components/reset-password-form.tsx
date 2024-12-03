"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { ResetPasswordFormData, resetPasswordSchema } from '../schemas/auth.schema'

interface ResetPasswordFormProps {
  onBackToLogin: () => void
}

export const ResetPasswordForm = ({ onBackToLogin }: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Logique de réinitialisation du mot de passe ici
      console.log(data)
      setSuccess(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button
        onClick={onBackToLogin}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la connexion
      </button>

      {!success ? (
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nouveau mot de passe"
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

            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe"
                  className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  {...register('confirmPassword')}
                />
                <Lock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                  errors.confirmPassword ? 'text-red-500' : 'text-cyan-600'
                }`} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Le mot de passe doit contenir :</p>
            <ul className="list-disc list-inside mt-1">
              <li>Au moins 8 caractères</li>
              <li>Une lettre majuscule</li>
              <li>Une lettre minuscule</li>
              <li>Un chiffre</li>
              <li>Un caractère spécial</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-50 rounded-lg"
        >
          <p className="text-green-800">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
          <Button
            onClick={onBackToLogin}
            className="mt-4"
            variant="outline"
          >
            Retourner à la connexion
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
} 
