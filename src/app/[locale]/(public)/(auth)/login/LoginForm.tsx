"use client";
import { InputForm } from "@/components/_client/Form";
import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TokenPayload } from "@/interface/IAuth";
import { getOauthGoogleUrl } from "@/lib/authUtils";
import { socket } from "@/lib/socket";
import { decodeJWT, handleApiError } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useLoginMutation } from "@/queries/useAuth";
import { LoginBodyType, useLoginSchema } from "@/schemaValidations/auth.schema";
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
  const schema = useLoginSchema();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = form;
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
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <InputForm
                id="email"
                name="email"
                type="email"
                required
                placeholder="m@example.com"
                label={t("email")}
              />
              <InputForm
                id="password"
                name="password"
                required
                label={t("password")}
                type="password"
              />

              <Button type="submit" className="w-full" isLoading={isPending}>
                {t("title")}
              </Button>
              <Link href={getOauthGoogleUrl()}>
                <Button variant="outline" className="w-full" type="button">
                  {t("google-access")}
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
