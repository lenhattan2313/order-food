"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { TokenPayload } from "@/interface/IAuth";
import { socket } from "@/lib/socket";
import { decodeJWT, handleApiError } from "@/lib/utils";
import { useLoginMutation } from "@/queries/useAuth";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearToken = searchParams.get("clearToken");
  const { setRole } = useAuth();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isValid },
    handleSubmit,
    setError,
  } = form;
  const { mutateAsync, isPending } = useLoginMutation();
  async function onSubmit(dataForm: LoginBodyType) {
    try {
      const {
        message,
        data: { accessToken },
      } = await mutateAsync(dataForm);
      const decodeRole = decodeJWT<TokenPayload>(accessToken);
      decodeRole && setRole(decodeRole.role);
      toast({
        description: message,
      });
      socket.connect();
      router.push("/manage/dashboard");
    } catch (error) {
      handleApiError(error, setError);
    }
  }
  useEffect(() => {
    if (clearToken === "true") {
      setRole(undefined);
    }
  }, [clearToken, setRole]);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(onSubmit)();
            }}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={!isValid}
                isLoading={isPending}
              >
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
export default memo(function LoginFormMemo() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
});
