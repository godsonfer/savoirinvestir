import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Triangle } from 'lucide-react'

// import {FaGithub} from "react-icons/fa"
import { SignInFlow } from '../types'
import React, { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
// Interface for the sign-in form
interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

// Sign-in form component
const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions()
  // states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  // submission handler for password sign-up
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Les deux mots de passes sont différents')
      return
    }
    setPending(true)
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch((): void => {
        setError("Quelque chose s'est mal passée")
      })
      .finally((): void => {
        setPending(false)
        window.location.href = '/'
      })
  }

  return (
    <Card className='w-full h-full p-8' >
      <CardHeader className='px-0'>
        <CardTitle>
          Inscription
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
        <form action="" className='space-y-2.5' onSubmit={onPasswordSignUp} >
          <Input disabled={pending} value={name} className='top-2.5' type='password' placeholder='Nom complet' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value) }} />
          <Input disabled={pending} className='mb-3 top-2' value={email} type='email' placeholder='Email' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

          <Input disabled={pending} value={password} className='top-2.5' type='password' placeholder='Mot de passe' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <Input disabled={pending} value={confirmPassword} className='top-2.5' type='password' placeholder='Confirmation de mot passe' required onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setConfirmPassword(e.target.value) }} />

          <Button variant="default" className='w-full' size='lg' disabled={pending}> Continuer</Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button variant="outline" className='w-full relative mt-3' size='lg' disabled={pending}> Continuer avec Google</Button>
        </div>
        <p className='tex-xs text-muted-foreground'>N&apos;avez-vous pas un compte ?
          <span onClick={() => setState("signIn")} className='text-sky-700 hover:underline cursor-pointer'>Connexion</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUpCard
