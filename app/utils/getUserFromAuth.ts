import 'server-only'
import { auth } from '../auth'
import { getUser } from '../db'

export default async function getUserFromAuth() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User is not authenticated')
  }
  return await getUser(session.user.email)
}