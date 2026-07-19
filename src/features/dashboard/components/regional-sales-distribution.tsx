import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Region {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

interface RegionalSalesDistributionProps {
  data?: Region[];
}

export function RegionalSalesDistribution({ data = generateMockData() }: RegionalSalesDistributionProps) {
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
        <CardTitle className="text-sm font-semibold text-slate-700">BÖLGESEL SATIŞ DAĞILIMI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((region, index) => (
            <div key={region.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: region.color }} />
                  <span className="font-medium text-slate-700">{region.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">%{region.percentage}</span>
                  <span className="text-slate-400">{formatCurrency(region.amount)}</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${region.percentage}%`,
                    backgroundColor: region.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): Region[] {
  return [
    { name: "Marmara", percentage: 35, amount: 436012, color: "#3b82f6" },
    { name: "İç Anadolu", percentage: 25, amount: 311437, color: "#6366f1" },
    { name: "Ege", percentage: 18, amount: 224235, color: "#8b5cf6" },
    { name: "Akdeniz", percentage: 12, amount: 149490, color: "#a855f7" },
    { name: "Karadeniz", percentage: 7, amount: 87402, color: "#d946ef" },
    { name: "Doğu Anadolu", percentage: 3, amount: 37372, color: "#ec4899" },
  ];
}
