import 'server-only'
import { auth } from '../auth'
import { UserService } from '../services/userService'

export default async function getUserFromAuth() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User is not authenticated')
  }
  const user = await UserService.getUserByEmail(session.user.email)
  if (!user) {
    throw new Error('Authenticated but not found in our users database');
  }
  return user;
}