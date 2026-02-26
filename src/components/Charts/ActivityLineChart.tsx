import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartDataPoint } from '@/types/inventory';
import { Button } from '@/components/ui/button';

interface ActivityLineChartProps {
  data: ChartDataPoint[];
}

type TimeRange = '1M' | '3M' | '6M';

const ActivityLineChart = ({ data }: ActivityLineChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');

  const getFilteredData = () => {
    switch (timeRange) {
      case '1M':
        return data.slice(-1);
      case '3M':
        return data.slice(-3);
      case '6M':
      default:
        return data;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-bold text-foreground mb-2">{label}</p>
          <p className="text-primary flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
            Barang Masuk: {payload[0].value}
          </p>
          <p className="text-secondary flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
            Barang Keluar: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-section h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Aktivitas Logistik</h3>
        <div className="flex gap-1">
          {(['1M', '3M', '6M'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs px-3"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={getFilteredData()}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value: string) => (
              <span className="text-foreground font-medium text-sm">
                {value === 'masuk' ? 'Barang Masuk' : 'Barang Keluar'}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="masuk"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="keluar"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityLineChart;
