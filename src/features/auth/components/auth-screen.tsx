"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LoginForm } from '@/features/auth/components/login-form'
import { RegisterForm } from '@/features/auth/components/register-form'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import Image from 'next/image'
import { Loader } from '@/components/ui/loader'
import { AnimatedBackground } from '@/components/ui/animated-background'

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password'

export const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Loader />
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30 backdrop-blur-[1px]" />
      </div>

      {/* Section gauche (Logo et titre) */}
      <div className="relative z-10 hidden md:flex md:w-[45%] flex-col justify-center items-center p-8 lg:p-12">
        <motion.div 
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={280}
            height={220}
            className="h-auto drop-shadow-lg"
            priority
          />
        </motion.div>
        
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Plateforme de Formation
          </h1>
          <p className="text-lg text-gray-100 drop-shadow">
            Développez vos compétences en trading et investissement avec nos formations en ligne
          </p>
        </motion.div>
      </div>

      {/* Section droite (Formulaires) */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen md:min-h-0 md:justify-center">
        {/* Logo pour mobile uniquement */}
        <div className="md:hidden flex flex-col items-center pt-8 px-4">
          <motion.div 
            className="mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={140}
              height={100}
              className="h-auto drop-shadow-lg"
              priority
            />
          </motion.div>
          
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              Plateforme de Formation
            </h1>
            <p className="text-sm text-gray-100 px-4 drop-shadow">
              Développez vos compétences en trading et investissement
            </p>
          </motion.div>
        </div>

        {/* Conteneur du formulaire */}
        <div className="flex-grow flex flex-col justify-center px-4 py-6 md:px-12 lg:px-16">
          <motion.div 
            className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100 
            }}
          >
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {mode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm 
                      onRegisterClick={() => setMode('register')}
                      onForgotPasswordClick={() => setMode('forgot-password')}
                    />
                  </motion.div>
                )}
                {mode === 'register' && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RegisterForm 
                      onLoginClick={() => setMode('login')}
                    />
                  </motion.div>
                )}
                {mode === 'forgot-password' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ForgotPasswordForm
                      onBackToLogin={() => setMode('login')}
                    />
                  </motion.div>
                )}
                {mode === 'reset-password' && (
                  <motion.div
                    key="reset"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ResetPasswordForm
                      onBackToLogin={() => setMode('login')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Texte légal */}
          <motion.div 
            className="w-full max-w-md mx-auto text-center mt-6 text-sm text-gray-200 px-4 pb-6 md:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="leading-relaxed drop-shadow">
              En utilisant notre plateforme, vous acceptez nos{' '}
              <a href="/legal/terms" className="text-cyan-300 hover:text-cyan-200 hover:underline">
                conditions d&apos;utilisation
              </a>
              {' '}et notre{' '}
              <a href="/legal/privacy" className="text-cyan-300 hover:text-cyan-200 hover:underline">
                politique de confidentialité
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
