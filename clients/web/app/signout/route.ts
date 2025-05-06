import { signOut } from '@/app/auth';
import { redirect } from 'next/navigation';

export async function GET()
{
    await signOut()
    redirect('/login')
}