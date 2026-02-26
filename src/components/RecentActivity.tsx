import { ActivityItem } from '@/types/inventory';
import { formatDateTime } from '@/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="dashboard-section">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Aktivitas Terkini</h3>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'incoming'
                  ? 'bg-success/10'
                  : 'bg-secondary/10'
              }`}
            >
              {activity.type === 'incoming' ? (
                <ArrowDownCircle className="w-5 h-5 text-success" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-secondary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-foreground truncate">
                  {activity.item_name}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    activity.type === 'incoming'
                      ? 'bg-success/10 text-success'
                      : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  {activity.type === 'incoming' ? 'Masuk' : 'Keluar'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{activity.quantity} unit</span>
                <span>•</span>
                <span>{activity.region}</span>
                <span>•</span>
                <span className="text-xs">{formatDateTime(activity.date)}</span>
              </div>
              
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded ${
                  activity.status === 'Diterima'
                    ? 'bg-success/10 text-success'
                    : activity.status === 'Pinjam'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
