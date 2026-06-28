import { prisma } from "@/lib/prisma";

export async function ActivityFeed() {
  const logs =
    await prisma.activityLog.findMany({
      take: 20,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: true,
      },
    });

  return (
    <div className="space-y-2">
      LOGS
      {logs.map((log) => (
        <div
          key={log.id}
          className="rounded border p-3"
        >
          <div>
            {log.action}
          </div>

          <div className="text-sm text-gray-500">
            {log.user?.email}
          </div>
        </div>
      ))}
    </div>
  );
}