import { useState } from 'react';
import { OutgoingGoods } from '@/types/inventory';
import { formatDate } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, PackageMinus } from 'lucide-react';

interface OutgoingTableProps {
  data: OutgoingGoods[];
}

const OutgoingTable = ({ data }: OutgoingTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: OutgoingGoods['status']) => {
    const badges = {
      Alokasi: 'badge-primary',
      Pinjam: 'badge-warning',
      Rusak: 'badge-destructive',
      Hilang: 'badge-destructive',
    };
    return badges[status] || 'badge-primary';
  };

  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <PackageMinus className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Barang Keluar</h3>
            <p className="text-sm text-muted-foreground">Daftar barang yang keluar dari gudang</p>
          </div>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="font-semibold">No. Permintaan</TableHead>
              <TableHead className="font-semibold">Nama Barang</TableHead>
              <TableHead className="font-semibold">Penerima</TableHead>
              <TableHead className="font-semibold">Jumlah</TableHead>
              <TableHead className="font-semibold">Tanggal</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-secondary/5 transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <TableCell className="font-mono text-sm">{item.request_no}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="font-medium">{item.item_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.employee_name}</p>
                    <p className="text-xs text-muted-foreground">{item.division}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{item.quantity}</span>
                  <span className="text-muted-foreground ml-1">{item.unit}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(item.request_date)}</TableCell>
                <TableCell>
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.allocation_region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OutgoingTable;
