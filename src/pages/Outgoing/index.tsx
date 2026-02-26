import { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import OutgoingTable from '@/components/Tables/OutgoingTable';
import { mockOutgoingGoods } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus } from 'lucide-react';

const OutgoingPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Barang Keluar</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua barang yang keluar dari gudang
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Ekspor
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Baru
            </Button>
          </div>
        </div>

        {/* Table */}
        <OutgoingTable data={mockOutgoingGoods} />
      </div>
    </DashboardLayout>
  );
};

export default OutgoingPage;
