import { prisma } from "@/lib/prisma";

export async function CustomerStatsCards() {
  const [
    totalCustomers,
    activeCustomers,
    passiveCustomers,
  ] = await Promise.all([
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.customer.count({ where: { deletedAt: null, is_active: true } }),
    prisma.customer.count({ where: { deletedAt: null, is_active: false } }),
  ]);

  const potentialCustomers = totalCustomers - activeCustomers - passiveCustomers;
  
  // Mock balance data - in real app this would come from actual transactions
  const totalBalance = 2458750.00;

  const stats = [
    {
      title: "Toplam Müşteri",
      value: totalCustomers,
      icon: "👥"
    },
    {
      title: "Aktif Müşteri",
      value: activeCustomers,
      icon: "✓"
    },
    {
      title: "Potansiyel Müşteri",
      value: potentialCustomers,
      icon: "🎯"
    },
    {
      title: "Pasif Müşteri",
      value: passiveCustomers,
      icon: "○"
    },
    {
      title: "Toplam Cari Bakiye",
      value: totalBalance,
      isCurrency: true,
      icon: "💰"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
        >
          <p className="text-xs font-medium text-slate-600 mb-2">{stat.title}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-semibold text-slate-800">
              {stat.isCurrency 
                ? stat.value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
                : stat.value.toLocaleString('tr-TR')
              }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
