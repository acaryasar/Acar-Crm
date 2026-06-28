import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";
import { requireRole } from "@/lib/auth-guard";

export default async function NotificationsPage() {
  const session = await requireRole(["ADMIN", "MANAGER", "SUPERVISOR", "EMPLOYEE"]);
  const { companyId, id: userId } = session.user as { companyId: string; id: string };

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const locale = localeCookie && isLocale(localeCookie.value) ? localeCookie.value : defaultLocale;

  const notifications = await prisma.notification.findMany({
    where: {
      companyId,
      OR: [
        { userId },
        { userId: null },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const typeColors = {
    INFO: "bg-blue-100 text-blue-700",
    SUCCESS: "bg-green-100 text-green-700",
    WARNING: "bg-yellow-100 text-yellow-700",
    ERROR: "bg-red-100 text-red-700",
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center relative">
          <span className="text-xl">🔔</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500">{unread} unread</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <div className="text-4xl mb-3">🔕</div>
            <p className="text-slate-500 font-medium">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl border p-4 shadow-sm ${
                !notification.isRead ? "bg-indigo-50 border-indigo-200" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[notification.type as keyof typeof typeColors]}`}>
                      {notification.type}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{notification.title}</h3>
                  {notification.message && (
                    <p className="text-slate-600 mt-1">{notification.message}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <form
                    action={async () => {
                      "use server";
                      await prisma.notification.update({
                        where: { id: notification.id },
                        data: { isRead: true },
                      });
                      const { revalidatePath } = await import("next/cache");
                      revalidatePath("/dashboard/notifications");
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Mark as Read
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
