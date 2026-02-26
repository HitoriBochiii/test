import {
  Package,
  PackageMinus,
  Boxes,
  Clock,
  TrendingUp,
  Building2,
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatCard from '@/components/StatCard';
import OwnershipPieChart from '@/components/Charts/OwnershipPieChart';
import ActivityLineChart from '@/components/Charts/ActivityLineChart';
import IncomingTable from '@/components/Tables/IncomingTable';
import OutgoingTable from '@/components/Tables/OutgoingTable';
import RecentActivity from '@/components/RecentActivity';
import {
  mockDashboardStats,
  mockOwnershipData,
  mockActivityChartData,
  mockIncomingGoods,
  mockOutgoingGoods,
  mockRecentActivity,
} from '@/data/mockData';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Selamat Datang Kembali!</h2>
              <p className="text-primary-foreground/80 mt-1">
                Pantau aktivitas inventaris gudang Pertamina Patra Niaga secara real-time
              </p>
            </div>
            <Building2 className="w-16 h-16 text-primary-foreground/30" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Barang Masuk"
            value={mockDashboardStats.totalIncoming}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Total Barang Keluar"
            value={mockDashboardStats.totalOutgoing}
            icon={PackageMinus}
            trend={{ value: 8, isPositive: true }}
            variant="secondary"
          />
          <StatCard
            title="Total Asset"
            value={mockDashboardStats.totalAsset}
            icon={Boxes}
            variant="primary"
          />
          <StatCard
            title="Total Sewa"
            value={mockDashboardStats.totalSewa}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Item Pending"
            value={mockDashboardStats.pendingItems}
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
            variant="warning"
          />
          <StatCard
            title="Alokasi Aktif"
            value={mockDashboardStats.activeAllocations}
            icon={TrendingUp}
            variant="primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityLineChart data={mockActivityChartData} />
          </div>
          <div>
            <OwnershipPieChart data={mockOwnershipData} />
          </div>
        </div>

        {/* Recent Activity & Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <IncomingTable data={mockIncomingGoods} />
            <OutgoingTable data={mockOutgoingGoods} />
          </div>
          <div>
            <RecentActivity activities={mockRecentActivity} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
