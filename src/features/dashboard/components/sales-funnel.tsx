import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface SalesFunnelProps {
  data?: FunnelStage[];
}

export function SalesFunnel({ data = generateMockData() }: SalesFunnelProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">SATIŞ HUNİSİ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((stage, index) => (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{stage.count}</span>
                  <span className="text-slate-400">(%{stage.percentage})</span>
                </div>
              </div>
              <div className="h-8 rounded-lg overflow-hidden bg-slate-100 relative">
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${(stage.count / maxCount) * 100}%`,
                    backgroundColor: stage.color,
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

function generateMockData(): FunnelStage[] {
  return [
    { name: "Teklif", count: 320, percentage: 100, color: "#3b82f6" },
    { name: "Teklif Onay", count: 280, percentage: 87.5, color: "#6366f1" },
    { name: "Sipariş", count: 256, percentage: 80, color: "#8b5cf6" },
    { name: "Sevkiyat", count: 240, percentage: 75, color: "#a855f7" },
    { name: "Tahsilat", count: 230, percentage: 71.9, color: "#d946ef" },
  ];
}
