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
import { TokenPayload } from "@/interface/IAuth";
import { getOauthGoogleUrl } from "@/lib/authUtils";
import { socket } from "@/lib/socket";
import { decodeJWT, handleApiError } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useLoginMutation } from "@/queries/useAuth";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const t = useTranslations("login");
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
        data: { accessToken },
      } = await mutateAsync(dataForm);
      const decodeRole = decodeJWT<TokenPayload>(accessToken);
      decodeRole && setRole(decodeRole.role);
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

  // useGoogleOneTapLogin({
  //   onError: (error) => console.log(error),
  //   onSuccess: (response) => console.log(response),
  //   googleAccountConfigs: {
  //     client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  //   },
  // });
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
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
              <Link href={getOauthGoogleUrl()}>
                <Button variant="outline" className="w-full" type="button">
                  Đăng nhập bằng Google
                </Button>
              </Link>
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
