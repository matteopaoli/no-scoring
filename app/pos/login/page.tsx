import { auth } from '@/app/auth';
import SignIn from './login';
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user.role === 'pos') {
    redirect('/app')
  }
  
  return (
    <SignIn />
  )
}
