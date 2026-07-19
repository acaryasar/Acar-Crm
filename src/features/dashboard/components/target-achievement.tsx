import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TargetAchievementProps {
  achieved?: number;
  target?: number;
}

export function TargetAchievement({ achieved = 1245750, target = 975000 }: TargetAchievementProps) {
  const percentage = Math.round((achieved / target) * 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;
  
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
        <CardTitle className="text-sm font-semibold text-slate-700">HEDEF GERÇEKLEŞME</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="140" height="140" className="transform -rotate-90">
              <circle
                cx="70"
                cy="70"
                r="54"
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r="54"
                stroke={percentage >= 100 ? "#10b981" : "#3b82f6"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${percentage >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                  %{percentage}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-slate-500">Gerçekleşen:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(achieved)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-slate-500">Hedef:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(target)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
