import SignIn from './login';
import { redirect } from 'next/navigation'
import getUserFromAuth from '@/app/utils/getUserFromAuth';
import { auth } from '@/app/auth';

export default async function LoginPage() {
  const session = await auth();
  if (["user", "pos"].includes(session?.user.role)) {
    redirect("/pos");
  }
  
  return (
    <SignIn />
  )
}
