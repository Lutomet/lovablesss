import { Account } from "./Dashboard";
import { Card } from "./ui/card";
import { TrendingUp, Calendar, Award } from "lucide-react";

interface StatsPanelProps {
  accounts: Account[];
  stats?: {
    today_count: number;
    week_count: number;
    total_count: number;
  };
}

export const StatsPanel = ({ accounts, stats }: StatsPanelProps) => {
  const totalToday = stats?.today_count || 0;
  const totalWeek = stats?.week_count || 0;
  const totalAll = stats?.total_count || accounts.reduce((sum, acc) => sum + acc.messagesSent, 0);

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        Statistics Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today</p>
              <p className="text-3xl font-bold">{totalToday}</p>
              <p className="text-xs text-muted-foreground mt-1">messages sent</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Week</p>
              <p className="text-3xl font-bold">{totalWeek.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">messages sent</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center">
              <Award className="w-7 h-7 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">All Time</p>
              <p className="text-3xl font-bold">{totalAll.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                messages sent • Rank #1
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
