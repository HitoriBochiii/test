import { useState } from 'react';
import { IncomingGoods } from '@/types/inventory';
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
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface IncomingTableProps {
  data: IncomingGoods[];
}

const IncomingTable = ({ data }: IncomingTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Barang Masuk</h3>
            <p className="text-sm text-muted-foreground">Daftar barang yang masuk ke gudang</p>
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
              <TableHead className="font-semibold">No. Seri</TableHead>
              <TableHead className="font-semibold">Nama Barang</TableHead>
              <TableHead className="font-semibold">Jumlah</TableHead>
              <TableHead className="font-semibold">Vendor</TableHead>
              <TableHead className="font-semibold">Tanggal DO</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.id}
                className={`hover:bg-success/5 transition-colors ${
                  index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <TableCell className="font-mono text-sm">{item.serial_number}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="font-medium">{item.item_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{item.quantity}</span>
                  <span className="text-muted-foreground ml-1">{item.unit}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.vendor}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(item.do_date)}</TableCell>
                <TableCell>
                  <span className={item.asset_status === 'Asset' ? 'badge-primary' : 'badge-warning'}>
                    {item.asset_status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.region}</TableCell>
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

export default IncomingTable;
