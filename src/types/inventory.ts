export interface IncomingGoods {
  id: string;
  contract_date: string;
  contract_no: string;
  delivery_no: string;
  do_date: string;
  quantity: number;
  remarks: string;
  region: string;
  sppb: string;
  serial_number: string;
  item_name: string;
  item_type: string;
  unit: string;
  part_number: string;
  material_id: string;
  material_group: string;
  description: string;
  inspection_date: string;
  asset_status: 'Asset' | 'Sewa';
  lease_end_date?: string;
  category: string;
  vendor: string;
}

export interface OutgoingGoods {
  id: string;
  request_date: string;
  request_no: string;
  function_div: string;
  employee_id: string;
  employee_name: string;
  division: string;
  phone: string;
  email: string;
  position: string;
  work_location: string;
  remarks: string;
  technician_name: string;
  origin_region: string;
  allocation_region: string;
  serial_number: string;
  item_name: string;
  quantity: number;
  unit: string;
  status: 'Alokasi' | 'Pinjam' | 'Rusak' | 'Hilang';
  return_date?: string;
}

export interface DashboardStats {
  totalIncoming: number;
  totalOutgoing: number;
  totalAsset: number;
  totalSewa: number;
  pendingItems: number;
  activeAllocations: number;
}

export interface ActivityItem {
  id: string;
  type: 'incoming' | 'outgoing';
  item_name: string;
  quantity: number;
  date: string;
  status: string;
  region: string;
}

export interface ChartDataPoint {
  name: string;
  masuk: number;
  keluar: number;
}

export interface OwnershipData {
  name: string;
  value: number;
  color: string;
}
