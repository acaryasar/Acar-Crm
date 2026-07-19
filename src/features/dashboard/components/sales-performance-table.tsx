import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalesPerson {
  name: string;
  salesAmount: number;
  orderCount: number;
  approvalAmount: number;
  collectionRate: number;
  commissionAmount: number;
  targetAchievement: number;
}

interface SalesPerformanceTableProps {
  data?: SalesPerson[];
}

export function SalesPerformanceTable({ data = generateMockData() }: SalesPerformanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">SATIŞ PERSONELİ PERFORMANSI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-600">Personel</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Satış Tutarı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Sipariş Adedi</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Onay Tutarı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Tahsilat Oranı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Prim Tutarı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Hedef Gerçekleşme</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((person, index) => (
                <TableRow key={index} className="hover:bg-slate-50">
                  <TableCell className="text-sm font-medium text-slate-700">{person.name}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(person.salesAmount)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{person.orderCount}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(person.approvalAmount)}</TableCell>
                  <TableCell className="text-sm text-right">
                    <span className={`font-medium ${person.collectionRate >= 90 ? 'text-emerald-600' : person.collectionRate >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      %{person.collectionRate}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(person.commissionAmount)}</TableCell>
                  <TableCell className="text-sm text-right">
                    <span className={`font-medium ${person.targetAchievement >= 100 ? 'text-emerald-600' : person.targetAchievement >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                      %{person.targetAchievement}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): SalesPerson[] {
  return [
    { name: "Ahmet Yılmaz", salesAmount: 285000, orderCount: 58, approvalAmount: 270000, collectionRate: 94, commissionAmount: 28500, targetAchievement: 128 },
    { name: "Mehmet Demir", salesAmount: 245000, orderCount: 52, approvalAmount: 230000, collectionRate: 91, commissionAmount: 24500, targetAchievement: 115 },
    { name: "Ayşe Kaya", salesAmount: 198000, orderCount: 45, approvalAmount: 185000, collectionRate: 88, commissionAmount: 19800, targetAchievement: 98 },
    { name: "Ali Çelik", salesAmount: 175000, orderCount: 38, approvalAmount: 165000, collectionRate: 95, commissionAmount: 17500, targetAchievement: 92 },
    { name: "Fatma Özkan", salesAmount: 152000, orderCount: 35, approvalAmount: 140000, collectionRate: 89, commissionAmount: 15200, targetAchievement: 85 },
  ];
}
