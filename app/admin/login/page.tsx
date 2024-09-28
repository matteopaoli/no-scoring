import { DictionaryProvider } from '@/app/DictionaryProvider';
import SignIn from './login';

export default function LoginPage() {
  return (
    <DictionaryProvider>
      <SignIn />
    </DictionaryProvider>
  )
}
