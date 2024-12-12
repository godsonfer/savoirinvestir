import { AuthScreen } from '@/features/auth/components/auth-screen'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Création de compte - Connexion - Invest Mastery Mind',
  description: 'Créez ou connectez votre compte pour accéder aux catalogues de  formations en ligne',
}

const Auth = () => {
  return <AuthScreen />
}

export default Auth
