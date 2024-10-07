import LoginForm from '@/app/[locale]/(public)/(auth)/login/LoginForm';
import Logout from '@/app/[locale]/(public)/(auth)/login/logout';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
      <Logout />
    </div>
  );
}
