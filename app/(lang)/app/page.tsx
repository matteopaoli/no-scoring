import { auth } from 'app/auth';
export default async function ProtectedPage() {
  // let session = await auth();

  return (
    <h1>App dashboard page</h1>
  );
}
