import { auth } from 'app/auth';
import Dashboard from '../../layouts/admin'

export default async function ProtectedPage() {
  // let session = await auth();

  return (
    <Dashboard></Dashboard>
  );
}
