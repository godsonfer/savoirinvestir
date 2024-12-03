"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail } from 'lucide-react'
import { ForgotPasswordFormData, forgotPasswordSchema } from '../schemas/auth.schema'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [emailSent, setEmailSent] = useState(false)
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Logique d'envoi d'email ici
      console.log(data)
      setEmailSent(true)
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

      {!emailSent ? (
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <Button
            type="submit"
            className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer les instructions'}
          </Button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-green-50 rounded-lg"
        >
          <p className="text-green-800">
            Un email avec les instructions de réinitialisation a été envoyé à votre adresse email.
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
