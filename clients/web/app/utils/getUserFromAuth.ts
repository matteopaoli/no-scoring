import 'server-only'
import { auth, signOut } from '../auth'
import { UserService } from '../services/userService'
import { redirect } from 'next/navigation'

export default async function getUserFromAuth() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User is not authenticated')
  }
  const user = await UserService.getUserByEmail(session.user.email)
  if (!user) {
    redirect('/signout')
  }
  return user;
}