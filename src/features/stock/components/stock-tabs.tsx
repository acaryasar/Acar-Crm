"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

interface StockTabsProps {
  allProducts: Product[];
  defaultTab?: string;
}

export function StockTabs({ allProducts, defaultTab = "all" }: StockTabsProps) {
  const criticalProducts = allProducts.filter(
    (product) => product.currentStock <= product.minStock && product.currentStock > 0
  );
  
  const outOfStockProducts = allProducts.filter(
    (product) => product.currentStock === 0
  );

  return (
    <Tabs defaultValue={defaultTab} className="h-full flex flex-col">
      <TabsList className="shrink-0">
        <TabsTrigger value="all">
          Tüm Stoklar ({allProducts.length})
        </TabsTrigger>
        <TabsTrigger value="critical">
          Kritik Stoklar ({criticalProducts.length})
        </TabsTrigger>
        <TabsTrigger value="out-of-stock">
          Stokta Olmayan ({outOfStockProducts.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="flex-1 min-h-0 mt-4">
        <StockTable products={allProducts} />
      </TabsContent>
      
      <TabsContent value="critical" className="flex-1 min-h-0 mt-4">
        <StockTable products={criticalProducts} />
      </TabsContent>
      
      <TabsContent value="out-of-stock" className="flex-1 min-h-0 mt-4">
        <StockTable products={outOfStockProducts} />
      </TabsContent>
    </Tabs>
  );
}
