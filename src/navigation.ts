// Lightweight wrappers around Next.js' navigation APIs

import { routing } from "@/i18n/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
