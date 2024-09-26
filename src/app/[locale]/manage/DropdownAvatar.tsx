"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socket } from "@/lib/socket";
import { handleApiError } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { useGetAccountMe } from "@/queries/useAccount";
import { useLogoutMutation } from "@/queries/useAuth";
import { useCallback, useEffect, useMemo } from "react";

export default function DropdownAvatar() {
  const router = useRouter();
  const { data } = useGetAccountMe();
  const account = useMemo(() => data?.data, [data]);
  const { setRole } = useAuth();
  const { mutateAsync, isPending } = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await mutateAsync();
      setRole(undefined);
      socket.disconnect();
      router.push("/");
    } catch (error) {
      handleApiError(error);
    }
  }, []);
  useEffect(() => {
    socket.on("logout", handleLogout);
    return () => {
      socket.off("logout", handleLogout);
    };
  }, [handleLogout]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={account?.avatar ?? undefined}
              alt={account?.name}
            />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
