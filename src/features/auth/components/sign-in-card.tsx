import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
// import {FaGithub} from "react-icons/fa"

import { SignInFlow } from '../types'
import React, { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { Triangle } from 'lucide-react'
import { resend } from '@/lib/resend'


// Interface for the sign-in form
interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

// Sign-in form component
const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions()

  // states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  // submission handler for password sign-in
  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    signIn('password', { email, password, flow: 'signIn' })
      .catch((): void => {
        setError("Quelque chose s'est mal passée")
      })
      .finally(async (): Promise<void> => {
        const sendEmail = await resend.emails.send ({
          from: "Savoir Investir <savoirinvestir@investmasterymind.pro>",
          to: email,
          subject: "Connexion réussie",
          html: "<p>Connexion réussie</p>"
        })
        console.log(sendEmail)
        setPending(false)
        window.location.href = '/'
      })
  }

  return (
    <Card className='w-full h-full p-8' >
      <CardHeader className='px-0'>
        <CardTitle>
          Connexion pour continuer
        </CardTitle>

        <CardDescription>
          Utiliser votre Email ou service pour continuer
        </CardDescription>
        {!!error &&
          <div className='bg-destructive/5 p-3 text-xs mb-6 rounded-xl flex items-center gap-x-3'>
            <Triangle className='size-3' />
            <p>
              {error}
            </p>
          </div>
        }
      </CardHeader>

      <CardContent className='space-y-5 px-0'>
        <form onSubmit={onPasswordSignIn} className='space-y-2.5 '>
          <Input disabled={pending} className='mb-3 top-2' value={email} type='email' placeholder='Email' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <Input disabled={pending} value={password} className='top-2.5' type='password' placeholder='Mot de passe' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

          <Button variant="default" type='submit' className='w-full' size='lg' disabled={pending}> Continuer</Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button disabled={pending} variant="outline" className='w-full relative mt-3' size='lg'> Continuer avec Google</Button>
        </div>
        <p className='tex-xs text-muted-foreground'>N&apos;avez-vous pas un compte ?
          <span onClick={() => setState("signUp")} className='text-sky-700 hover:underline cursor-pointer'>Inscription</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignInCard
