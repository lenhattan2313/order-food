"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils";
import { useAccountMeMutation, useGetAccountMe } from "@/queries/useAccount";
import { useUploadAvatar } from "@/queries/useMedia";
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { data } = useGetAccountMe({
    queryKey: ["account_profile", "settings"],
  });

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: null,
    },
  });
  const {
    watch,
    reset,
    handleSubmit,
    setError,
    formState: {},
  } = form;
  const [avatar, name] = watch(["avatar", "name"]);

  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    //TODO: validate type of file
    const inputFile = e.target.files?.[0];
    if (inputFile) {
      setFile(inputFile);
    }
  }
  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar ?? "";
  }, [avatar, file]);
  const { mutateAsync: uploadAvatar, isPending: isUploadAvatarLoading } =
    useUploadAvatar();
  const { mutateAsync: updateAccountMe, isPending: isAccountMeUpdateLoading } =
    useAccountMeMutation();
  async function onSubmit(dataForm: UpdateMeBodyType) {
    try {
      let body = { ...dataForm };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await uploadAvatar(formData);
        body.avatar = data;
      }
      const { message } = await updateAccountMe(body);

      toast({ description: message });
    } catch (error) {
      handleApiError(error, setError);
    }
  }
  const handleReset = useCallback(
    ({ data: { avatar, name } }: AccountResType) => {
      setFile(null);
      reset((pre) => ({ ...pre, name, avatar }));
    },
    [reset]
  );
  useMemo(() => {
    if (data) {
      handleReset(data);
    }
  }, [data, handleReset]);

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        onReset={() => data && handleReset(data)}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} alt="avartar" />
                        <AvatarFallback className="rounded-none">
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={handleChangeFile}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  isLoading={isAccountMeUpdateLoading || isUploadAvatarLoading}
                >
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
