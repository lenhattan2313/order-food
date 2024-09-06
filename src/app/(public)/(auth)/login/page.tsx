import LoginForm from "@/app/(public)/(auth)/login/login-form";
import Logout from "@/app/(public)/(auth)/login/logout";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
      <Logout />
    </div>
  );
}
