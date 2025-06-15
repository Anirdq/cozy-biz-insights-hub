
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'teal' | 'purple' | 'green';
  isLoading?: boolean;
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  },
  teal: {
    icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400'
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  },
  green: {
    icon: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  }
};

export const MetricCard = ({ title, value, change, trend, icon: Icon, color, isLoading = false }: MetricCardProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const classes = colorClasses[color];

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${classes.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge className={`${classes.badge} border-0`}>
            <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
            {change}
          </Badge>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </h3>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
