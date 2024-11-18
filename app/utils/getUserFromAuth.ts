import 'server-only'
import { auth } from '../auth'
import { UserService } from '../services/userService'

export default async function getUserFromAuth() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User is not authenticated')
  }
  return await UserService.getUserByEmail(session.user.email)
}