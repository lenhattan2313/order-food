"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils";
import { useCreateEmployee } from "@/queries/useAccount";
import { useUploadAvatar } from "@/queries/useMedia";
import {
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
const defaultAccount = {
  name: "",
  email: "",
  avatar: undefined,
  password: "",
  confirmPassword: "",
};
export default function AddEmployee() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: defaultAccount,
  });
  const { setError, reset, handleSubmit } = form;

  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);
  const { mutateAsync: uploadAvatar, isPending: isUploadPending } =
    useUploadAvatar();
  const { mutateAsync: createEmployee, isPending: isCreatePending } =
    useCreateEmployee();
  async function onSubmit(dataForm: CreateEmployeeAccountBodyType) {
    try {
      let body = { ...dataForm };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await uploadAvatar(formData);
        ``;
        body.avatar = data;
      }
      const { message } = await createEmployee(body);

      toast({ description: message });
      handleReset();
    } catch (error) {
      handleApiError(error, setError);
    }
  }
  function handleReset() {
    setFile(null);
    reset(defaultAccount);
    setOpen((pre) => !pre);
  }
  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    //TODO: validate type of file
    const inputFile = e.target.files?.[0];
    if (inputFile) {
      setFile(inputFile);
    }
  }

  return (
    <Dialog onOpenChange={handleReset} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo tài khoản
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-employee-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">
                          {name || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={handleChangeFile}
                        className="hidden"
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
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="password"
                          className="w-full"
                          type="password"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="confirmPassword"
                          className="w-full"
                          type="password"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-employee-form"
            isLoading={isCreatePending || isUploadPending}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}