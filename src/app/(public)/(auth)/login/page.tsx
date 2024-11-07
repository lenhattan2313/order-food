import LoginForm from '@/app/(public)/(auth)/login/LoginForm';
import Logout from '@/app/(public)/(auth)/login/logout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Bạn có thể sẽ mất đơn hàng của mình</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <Logout />
    </div>
  );
}
