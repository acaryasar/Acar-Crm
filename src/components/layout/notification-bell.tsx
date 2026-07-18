import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Bell } from "lucide-react";
import { unstable_cache } from "next/cache";

const getNotificationCount = unstable_cache(
  async (companyId: string, userId: string) => {
    return await prisma.notification.count({
      where: {
        companyId,
        userId,
        isRead: false,
      },
    });
  },
  ["notification-count"],
  { revalidate: 60, tags: ["notifications"] }
);

export async function NotificationBell() {
  const session = await auth();

  if (!session?.user) return null;

  const count = await getNotificationCount(session.user.companyId, session.user.id);

  return (
    <Link
      href="/dashboard/notifications"
      className="relative flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
    >
      <Bell size={16} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
