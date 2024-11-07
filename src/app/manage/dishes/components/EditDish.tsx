'use client';
import { getVietnameseDishStatus } from '@/app/manage/dishes/utils/dishesUtils';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DishStatus, DishStatusValues } from '@/constants/type';
import { DishItem, useDishContext } from '@/context/dishContext';
import { toast } from '@/hooks/use-toast';
import { createImagePathS3, handleApiError } from '@/lib/utils';
import { useGetDishDetail, useUpdateDish } from '@/queries/useDish';
import { useUploadAvatar, useUploadImageToS3 } from '@/queries/useMedia';
import {
  UpdateDishBody,
  UpdateDishBodyType,
} from '@/schemaValidations/dish.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EditDish() {
  const { setDishIdEdit, dishIdEdit } = useDishContext();
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      status: DishStatus.Unavailable,
    },
  });
  const { setError, reset, handleSubmit } = form;

  const image = form.watch('image');
  const name = form.watch('name');
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);
  const { data } = useGetDishDetail({ id: dishIdEdit });
  const handleReset = useCallback(
    ({ image, id, ...data }: DishItem) => {
      setFile(null);
      reset((pre) => ({ ...pre, ...data, image: image ?? undefined }));
    },
    [reset],
  );
  useMemo(() => {
    if (data) {
      handleReset(data.data);
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
  const { mutateAsync: uploadToS3, isPending: isUploadS3Pending } =
    useUploadImageToS3();
  const { mutateAsync: updateDish, isPending: isUpdatePending } =
    useUpdateDish();
  async function onSubmit(dataForm: UpdateDishBodyType) {
    if (!dishIdEdit) return;
    try {
      let body = { ...dataForm };
      if (file) {
        const uploadImage = dataForm.isUploadS3 ? uploadToS3 : uploadAvatar;
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await uploadImage(formData);
        ``;
        body.image = dataForm.isUploadS3
          ? createImagePathS3(data, 'dish')
          : data;
      }

      const { message } = await updateDish({
        id: dishIdEdit,
        ...body,
      });

      toast({ description: message });
      handleCloseModal(false);
    } catch (error) {
      handleApiError(error, setError);
    }
  }

  function handleCloseModal(value: boolean) {
    if (!value) {
      setDishIdEdit(undefined);
      data && handleReset(data.data);
    }
  }

  return (
    <Dialog open={Boolean(dishIdEdit)} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>
            Các trường sau đây là bắ buộc: Tên, ảnh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="isUploadS3"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Upload to S3</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
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
                        ref={imageInputRef}
                        onChange={handleChangeFile}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
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
                      <Label htmlFor="name">Tên món ăn</Label>
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Mô tả sản phẩm</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          id="description"
                          className="w-full"
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
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
            form="edit-dish-form"
            isLoading={isUpdatePending || isUploadPending || isUploadS3Pending}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
