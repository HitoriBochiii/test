import { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download, Calendar, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockIncomingGoods, mockOutgoingGoods } from '@/data/mockData';
import * as XLSX from 'xlsx';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('all');
  const [period, setPeriod] = useState('monthly');

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Barang Masuk
    const incomingData = mockIncomingGoods.map(item => ({
      'No. Seri': item.serial_number,
      'Nama Barang': item.item_name,
      'Tipe': item.item_type,
      'Jumlah': item.quantity,
      'Satuan': item.unit,
      'Vendor': item.vendor,
      'Tanggal DO': item.do_date,
      'Region': item.region,
      'Status': item.asset_status,
      'Kategori': item.category,
    }));
    const wsIncoming = XLSX.utils.json_to_sheet(incomingData);
    XLSX.utils.book_append_sheet(wb, wsIncoming, 'Barang Masuk');

    // Sheet 2: Barang Keluar
    const outgoingData = mockOutgoingGoods.map(item => ({
      'No. Permintaan': item.request_no,
      'Nama Barang': item.item_name,
      'Jumlah': item.quantity,
      'Satuan': item.unit,
      'Penerima': item.employee_name,
      'Divisi': item.division,
      'Tanggal': item.request_date,
      'Region': item.allocation_region,
      'Status': item.status,
    }));
    const wsOutgoing = XLSX.utils.json_to_sheet(outgoingData);
    XLSX.utils.book_append_sheet(wb, wsOutgoing, 'Barang Keluar');

    // Generate and download
    XLSX.writeFile(wb, `Laporan_Inventaris_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan unduh laporan inventaris dalam format Excel
          </p>
        </div>

        {/* Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Laporan Lengkap</CardTitle>
              <CardDescription>
                Export semua data barang masuk dan keluar dalam satu file Excel dengan 2 sheet terpisah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExport} className="w-full gap-2">
                <Download className="w-4 h-4" />
                Unduh Laporan Lengkap
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Laporan Barang Masuk</CardTitle>
              <CardDescription>
                Export khusus data barang masuk dengan detail lengkap termasuk vendor dan status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Unduh Barang Masuk
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Laporan Barang Keluar</CardTitle>
              <CardDescription>
                Export khusus data barang keluar dengan informasi penerima dan status alokasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Unduh Barang Keluar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Laporan Kustom
            </CardTitle>
            <CardDescription>
              Buat laporan dengan filter periode dan jenis data tertentu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Jenis Laporan</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="incoming">Barang Masuk</SelectItem>
                    <SelectItem value="outgoing">Barang Keluar</SelectItem>
                    <SelectItem value="asset">Khusus Asset</SelectItem>
                    <SelectItem value="sewa">Khusus Sewa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Periode</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="quarterly">Kuartalan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button className="w-full gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Generate Laporan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
