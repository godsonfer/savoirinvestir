import { AuthScreen } from '@/features/auth/components/auth-screen'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Authentification - Plateforme de Formation',
  description: 'Développez vos compétences en trading et investissement avec nos formations en ligne',
}

const Auth = () => {
  return <AuthScreen />
}

export default Auth
