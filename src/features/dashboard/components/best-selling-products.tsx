import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
  name: string;
  quantity: number;
  amount: number;
}

interface BestSellingProductsProps {
  data?: Product[];
}

export function BestSellingProducts({ data = generateMockData() }: BestSellingProductsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">EN ÇOK SATAN ÜRÜNLER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-600">Ürün Adı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Satış Adedi</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Satış Tutarı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product, index) => (
                <TableRow key={index} className="hover:bg-slate-50">
                  <TableCell className="text-sm font-medium text-slate-700">{product.name}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatNumber(product.quantity)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(product.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): Product[] {
  return [
    { name: "Endüstriyel Robot Kolu ER-500", quantity: 45, amount: 225000 },
    { name: "CNC İşleme Merkezi CM-2000", quantity: 28, amount: 168000 },
    { name: "Otomasyon Kontrol Ünitesi AKU-100", quantity: 120, amount: 144000 },
    { name: "Hidrolik Pres HP-300", quantity: 35, amount: 122500 },
    { name: "Lazer Kesim Makinesi LK-150", quantity: 18, amount: 108000 },
  ];
}
