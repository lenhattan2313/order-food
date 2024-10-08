'use client';
import { FormSelect, FormSwitch, InputForm } from '@/components/_client/Form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Role } from '@/constants/type';
import { AccountItem, useAccountContext } from '@/context/accountContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useGetEmployeeDetail, useUpdateEmployee } from '@/queries/useAccount';
import { useUploadAvatar } from '@/queries/useMedia';
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from '@/schemaValidations/account.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
export default function EditEmployee() {
  const t = useTranslations();
  const { setEmployeeIdEdit, employeeIdEdit } = useAccountContext();
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
      role: Role.Employee,
    },
  });
  const { setError, reset, handleSubmit } = form;
  const [name, avatar] = form.watch(['name', 'avatar']);
  const changePassword = form.watch('changePassword');

  const { data } = useGetEmployeeDetail({ id: employeeIdEdit });
  const handleReset = useCallback(
    ({ avatar, id, ...data }: AccountItem) => {
      setFile(null);
      reset((pre) => ({ ...pre, ...data, avatar: avatar ?? undefined }));
    },
    [reset],
  );
  useMemo(() => {
    if (data) {
      setTimeout(() => handleReset(data.data));
    }
  }, [data, handleReset]);
  function handleChangeFile(e: ChangeEvent<HTMLInputElement>) {
    //TODO: validate type of file
    const inputFile = e.target.files?.[0];
    if (inputFile) {
      setFile(inputFile);
    }
  }
  const { mutateAsync: uploadAvatar, isPending: isUploadPending } =
    useUploadAvatar();
  const { mutateAsync: updateEmployee, isPending: isUpdatePending } =
    useUpdateEmployee();
  async function onSubmit(dataForm: UpdateEmployeeAccountBodyType) {
    if (!employeeIdEdit) return;
    try {
      let body = { ...dataForm };
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await uploadAvatar(formData);
        body.avatar = data;
      }
      const { message } = await updateEmployee({ id: employeeIdEdit, ...body });

      toast({ description: message });
      handleCloseModal(false);
    } catch (error) {
      handleApiError(error, setError);
    }
  }

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  function handleCloseModal(value: boolean) {
    if (!value) {
      setEmployeeIdEdit(undefined);
      data && handleReset(data.data);
    }
  }
  const options = useMemo(
    () =>
      Object.values(Role)
        .filter((item) => item !== Role.Guest)
        .map((role) => ({
          value: role,
          label: role,
        })),
    [],
  );
  return (
    <Dialog open={Boolean(employeeIdEdit)} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('accounts.editTitle')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
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
                          {name || 'Avatar'}
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
              <InputForm name="name" label={t('common.name')} required />
              <InputForm name="email" label={t('common.email')} required />
              <FormSelect
                name="role"
                label={t('common.role')}
                required
                placeholder={t('accounts.selectRole')}
                options={options}
              />
              <FormSwitch
                name="changePassword"
                label={t('accounts.changePassword')}
              />

              {changePassword && (
                <>
                  <InputForm
                    name="password"
                    label={t('accounts.newPassword')}
                    required
                    type="password"
                  />
                  <InputForm
                    name="confirmPassword"
                    label={t('accounts.confirmNewPassword')}
                    required
                    type="password"
                  />
                </>
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-employee-form"
            isLoading={isUpdatePending || isUploadPending}
          >
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
