"use client";

import { useState } from "react";
import { StockStatsCards } from "./stock-stats-cards";
import { StockTable } from "./stock-table";

interface Product {
  id: string;
  name: string;
  code: string;
  currentStock: number;
  minStock: number;
  purchasePrice: string | null;
  salePrice: string;
  category: {
    id: string;
    name: string;
  } | null;
}

interface StockPageClientProps {
  allProducts: Product[];
  totalProducts: number;
  criticalStock: number;
  outOfStock: number;
  totalStockValue: number;
}

export function StockPageClient({
  allProducts,
  totalProducts,
  criticalStock,
  outOfStock,
  totalStockValue,
}: StockPageClientProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "out-of-stock">("all");

  const getFilteredProducts = () => {
    switch (filter) {
      case "critical":
        return allProducts.filter(
          (product) => product.currentStock <= product.minStock && product.currentStock > 0
        );
      case "out-of-stock":
        return allProducts.filter(
          (product) => product.currentStock === 0
        );
      default:
        return allProducts;
    }
  };

  return (
    <>
      <div className="mb-6">
        <StockStatsCards
          totalProducts={totalProducts}
          criticalStock={criticalStock}
          outOfStock={outOfStock}
          totalStockValue={totalStockValue}
          onTabClick={setFilter}
        />
      </div>

      <div className="flex-1 min-h-0">
        <StockTable products={getFilteredProducts()} />
      </div>
    </>
  );
}
