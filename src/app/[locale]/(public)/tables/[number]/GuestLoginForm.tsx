"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { TokenPayload } from "@/interface/IAuth";
import { socket } from "@/lib/socket";
import { decodeJWT, handleApiError } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useGuestLogin } from "@/queries/useGuest";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export default function GuestLoginForm() {
  const { setRole } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const params = useParams();
  const tableNumber = Number(params?.number ?? "1");
  const router = useRouter();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: "",
      tableNumber: 1,
    },
  });
  const { mutateAsync, isPending } = useGuestLogin();
  async function onSubmit(data: GuestLoginBodyType) {
    try {
      const {
        message,
        data: { accessToken },
      } = await mutateAsync({ ...data, tableNumber, token });
      const decodeRole = decodeJWT<TokenPayload>(accessToken);
      decodeRole && setRole(decodeRole.role);
      socket.connect();
      toast({ description: message });
      router.push("/guest/menu");
    } catch (error) {
      handleApiError(error, form.setError);
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" isLoading={isPending}>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
