import { prisma } from "@/lib/prisma";

export async function StockStatsCards() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    select: {
      currentStock: true,
      minStock: true,
      purchasePrice: true,
    },
  });

  const totalProducts = products.length;
  
  // Calculate total stock value (currentStock * purchasePrice)
  const totalStockValue = products.reduce((sum, product) => {
    const stockValue = product.currentStock * (parseFloat(product.purchasePrice || "0"));
    return sum + stockValue;
  }, 0);

  // Critical stock: products where currentStock <= minStock
  const criticalStock = products.filter(
    (product) => product.currentStock <= product.minStock
  ).length;

  // Out of stock: products where currentStock = 0
  const outOfStock = products.filter(
    (product) => product.currentStock === 0
  ).length;

  const stats = [
    {
      title: "Toplam Stok Değeri",
      value: totalStockValue,
      isCurrency: true,
      icon: "💰"
    },
    {
      title: "Toplam Ürün",
      value: totalProducts,
      icon: "📦"
    },
    {
      title: "Kritik Stok Sayısı",
      value: criticalStock,
      icon: "⚠️"
    },
    {
      title: "Stokta Olmayan",
      value: outOfStock,
      icon: "❌"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
