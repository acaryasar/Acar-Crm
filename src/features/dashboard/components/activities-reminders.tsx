import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Calendar, FileText, CheckCircle } from "lucide-react";

interface Reminder {
  type: "overdue" | "pending" | "critical" | "meeting" | "offer";
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface ActivitiesRemindersProps {
  data?: Reminder[];
}

export function ActivitiesReminders({ data = generateMockData() }: ActivitiesRemindersProps) {
  const getIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "overdue":
        return <AlertCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "critical":
        return <AlertCircle size={16} />;
      case "meeting":
        return <Calendar size={16} />;
      case "offer":
        return <FileText size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-700">AKTİVİTELER & HATIRLATMALAR</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((reminder, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${reminder.color}`}>
                {reminder.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{reminder.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-800">{reminder.count}</span>
                <span className="text-xs text-slate-400">adet</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockData(): Reminder[] {
  return [
    {
      type: "overdue",
      title: "Gecikmiş Tahsilatlar",
      count: 8,
      icon: <AlertCircle size={16} />,
      color: "bg-red-100 text-red-600",
    },
    {
      type: "pending",
      title: "Bekleyen Onaylar",
      count: 12,
      icon: <Clock size={16} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      type: "critical",
      title: "Kritik Stok Ürünleri",
      count: 5,
      icon: <AlertCircle size={16} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      type: "meeting",
      title: "Planlanan Toplantılar",
      count: 3,
      icon: <Calendar size={16} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "offer",
      title: "Bekleyen Teklifler",
      count: 7,
      icon: <FileText size={16} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];
}
