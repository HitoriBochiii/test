import { LucideIcon } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

const StatCard = ({ title, value, icon: Icon, trend, variant = 'primary' }: StatCardProps) => {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="stat-card animate-fade-in group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mt-2">{formatNumber(value)}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-semibold ${
                  trend.isPositive ? 'text-success' : 'text-destructive'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">dari bulan lalu</span>
            </div>
          )}
        </div>
        
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${variantStyles[variant]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
