import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Customer {
  name: string;
  salesAmount: number;
  grossProfit: number;
  profitMargin: number;
}

interface MostProfitableCustomersProps {
  data?: Customer[];
}

export function MostProfitableCustomers({ data = generateMockData() }: MostProfitableCustomersProps) {
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
        <CardTitle className="text-sm font-semibold text-slate-700">EN KARLI MÜŞTERİLER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-600">Müşteri Adı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Satış Tutarı</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Brüt Kar</TableHead>
                <TableHead className="text-xs font-semibold text-slate-600 text-right">Kar Marjı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((customer, index) => (
                <TableRow key={index} className="hover:bg-slate-50">
                  <TableCell className="text-sm font-medium text-slate-700">{customer.name}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(customer.salesAmount)}</TableCell>
                  <TableCell className="text-sm text-right text-slate-600">{formatCurrency(customer.grossProfit)}</TableCell>
                  <TableCell className="text-sm text-right">
                    <span className={`font-medium ${customer.profitMargin >= 25 ? 'text-emerald-600' : customer.profitMargin >= 15 ? 'text-amber-600' : 'text-red-600'}`}>
                      %{customer.profitMargin}
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

function generateMockData(): Customer[] {
  return [
    { name: "TeknoSan A.Ş.", salesAmount: 285000, grossProfit: 85500, profitMargin: 30 },
    { name: "Otomatik Sistemler Ltd.", salesAmount: 198000, grossProfit: 53460, profitMargin: 27 },
    { name: "Endüstriyel Çözümler A.Ş.", salesAmount: 175000, grossProfit: 43750, profitMargin: 25 },
    { name: "Makine İmalat San. Tic.", salesAmount: 152000, grossProfit: 31110, profitMargin: 20.5 },
    { name: "Global Teknoloji Ltd.", salesAmount: 128000, grossProfit: 23040, profitMargin: 18 },
  ];
}
