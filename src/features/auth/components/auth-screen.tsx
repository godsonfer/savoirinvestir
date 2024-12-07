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
import Link from 'next/link'

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password'

const Bubbles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full 
            ${i % 4 === 0 ? 'w-4 h-4' : i % 4 === 1 ? 'w-6 h-6' : i % 4 === 2 ? 'w-8 h-8' : 'w-12 h-12'}
            bg-gradient-to-br from-white/30 to-white/10
            after:content-[''] after:absolute after:inset-0 after:rounded-full 
            after:bg-gradient-to-br after:from-white/40 after:to-transparent after:blur-sm
            before:content-[''] before:absolute before:inset-0 before:rounded-full 
            before:bg-gradient-to-br before:from-white/30 before:to-transparent before:blur-md
            shadow-[0_0_10px_rgba(255,255,255,0.3)]
            dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]
            backdrop-blur-[2px]
          `}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ 
            scale: 0,
            opacity: 0 
          }}
          animate={{
            scale: [0.5 + Math.random() * 0.5],
            opacity: [0.4 + Math.random() * 0.4],
            y: [0, -500 - Math.random() * 300],
            x: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

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
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Bulles animées */}
          <Bubbles />

          {/* Cercles flous existants */}
          <motion.div
            className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-800/20 dark:to-pink-800/20 blur-[120px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 dark:from-blue-800/20 dark:to-cyan-800/20 blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-black/20 to-black/30 dark:from-black/20 dark:via-black/40 dark:to-black/50 backdrop-blur-[1px]" />
      </div>

      {/* Grain effect */}
      <div className="absolute inset-0 z-[1] opacity-20 mix-blend-soft-light">
        <div className="absolute inset-0 bg-repeat bg-noise animate-noise" />
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
            height={280}
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
        {/* Bouton Home */}
        <motion.div 
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Logo pour mobile uniquement */}
        <div className="md:hidden flex flex-col items-center pt-4 px-4">
          <motion.div 
            className="mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={85}
              className="h-auto drop-shadow-lg"
              priority
            />
          </motion.div>
          
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
              Plateforme de Formation
            </h1>
            <p className="text-xs text-gray-100 px-4 drop-shadow">
              Développez vos compétences en trading et investissement
            </p>
          </motion.div>
        </div>

        {/* Conteneur du formulaire */}
        <div className="flex-1 flex flex-col justify-center px-4 py-2 md:py-6 md:px-12 lg:px-16">
          <motion.div 
            className="w-full max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100 
            }}
          >
            <div className="p-4 md:p-8">
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
            className="w-full max-w-md mx-auto text-center mt-2 text-xs md:text-sm text-gray-200 dark:text-gray-300 px-4 pb-4 md:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="leading-relaxed drop-shadow">
              En utilisant notre plateforme, vous acceptez nos{' '}
              <Link href="/legal/terms" className="text-cyan-300 hover:text-cyan-200 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline">
                conditions d&apos;utilisation
              </Link>
              {' '}et notre{' '}
              <Link href="/legal/privacy" className="text-cyan-300 hover:text-cyan-200 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline">
                politique de confidentialité
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
