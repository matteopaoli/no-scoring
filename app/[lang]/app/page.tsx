import { auth, signOut } from 'app/auth';
import Dashboard from '../../layouts/admin'

export default async function ProtectedPage() {
  let session = await auth();
  

  return (
    <Dashboard></Dashboard>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
