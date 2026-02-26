import { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import IncomingTable from '@/components/Tables/IncomingTable';
import { mockIncomingGoods } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IncomingPage = () => {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Barang Masuk</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua barang yang masuk ke gudang
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import Excel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Data Barang Masuk</DialogTitle>
                  <DialogDescription>
                    Upload file Excel (.xlsx) atau CSV untuk mengimport data barang masuk secara massal.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop file di sini, atau klik untuk memilih
                    </p>
                    <Input
                      type="file"
                      accept=".xlsx,.csv"
                      className="mt-3"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setUploadOpen(false)}>
                      Batal
                    </Button>
                    <Button>Upload & Proses</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
        <IncomingTable data={mockIncomingGoods} />
      </div>
    </DashboardLayout>
  );
};

export default IncomingPage;
