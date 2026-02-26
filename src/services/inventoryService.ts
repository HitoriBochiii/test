import { IncomingGoods, OutgoingGoods } from '@/types/inventory';
import { inventoryApi, exportApi } from '@/services/api';
import * as XLSX from 'xlsx';
import { trimAndUppercase, sanitizeSerialNumber } from '@/utils/formatters';

// TRIM and UPPERCASE data cleaning
const cleanIncomingData = (row: any): Partial<IncomingGoods> => {
  return {
    contract_date: row.contract_date || row['Tanggal Kontrak'] || null,
    contract_no: trimAndUppercase(row.contract_no || row['No Kontrak'] || ''),
    delivery_no: trimAndUppercase(row.delivery_no || row['No Delivery'] || ''),
    do_date: row.do_date || row['Tanggal DO'] || null,
    quantity: parseInt(row.quantity || row['Kuantitas'] || row['Qty'] || '0', 10),
    remarks: row.remarks || row['Keterangan'] || '',
    region: trimAndUppercase(row.region || row['Region'] || row['Wilayah'] || ''),
    sppb: trimAndUppercase(row.sppb || row['SPPB'] || ''),
    serial_number: sanitizeSerialNumber(row.serial_number || row['Serial Number'] || row['SN'] || ''),
    item_name: trimAndUppercase(row.item_name || row['Nama Barang'] || ''),
    item_type: trimAndUppercase(row.item_type || row['Tipe Barang'] || ''),
    unit: trimAndUppercase(row.unit || row['Satuan'] || 'Unit'),
    part_number: trimAndUppercase(row.part_number || row['Part Number'] || ''),
    material_id: trimAndUppercase(row.material_id || row['Material ID'] || ''),
    material_group: trimAndUppercase(row.material_group || row['Material Group'] || ''),
    description: row.description || row['Deskripsi'] || '',
    inspection_date: row.inspection_date || row['Tanggal Inspeksi'] || null,
    asset_status: (trimAndUppercase(row.asset_status || row['Status Aset'] || 'Asset') === 'SEWA' ? 'Sewa' : 'Asset') as 'Asset' | 'Sewa',
    lease_end_date: row.lease_end_date || row['Tanggal Akhir Sewa'] || null,
    category: trimAndUppercase(row.category || row['Kategori'] || ''),
    vendor: trimAndUppercase(row.vendor || row['Vendor'] || ''),
  };
};

const cleanOutgoingData = (row: any): Partial<OutgoingGoods> => {
  return {
    request_date: row.request_date || row['Tanggal Permintaan'] || null,
    request_no: trimAndUppercase(row.request_no || row['No Permintaan'] || ''),
    function_div: trimAndUppercase(row.function_div || row['Fungsi/Divisi'] || ''),
    employee_id: trimAndUppercase(row.employee_id || row['ID Karyawan'] || ''),
    employee_name: trimAndUppercase(row.employee_name || row['Nama Karyawan'] || ''),
    division: trimAndUppercase(row.division || row['Divisi'] || ''),
    phone: row.phone || row['Telepon'] || '',
    email: row.email || row['Email'] || '',
    position: trimAndUppercase(row.position || row['Jabatan'] || ''),
    work_location: trimAndUppercase(row.work_location || row['Lokasi Kerja'] || ''),
    remarks: row.remarks || row['Keterangan'] || '',
    technician_name: trimAndUppercase(row.technician_name || row['Nama Teknisi'] || ''),
    origin_region: trimAndUppercase(row.origin_region || row['Region Asal'] || ''),
    allocation_region: trimAndUppercase(row.allocation_region || row['Region Alokasi'] || ''),
    serial_number: sanitizeSerialNumber(row.serial_number || row['Serial Number'] || row['SN'] || ''),
    item_name: trimAndUppercase(row.item_name || row['Nama Barang'] || ''),
    quantity: parseInt(row.quantity || row['Kuantitas'] || row['Qty'] || '1', 10),
    unit: trimAndUppercase(row.unit || row['Satuan'] || 'Unit'),
    status: (trimAndUppercase(row.status || row['Status'] || 'Alokasi')) as 'Alokasi' | 'Pinjam' | 'Rusak' | 'Hilang',
    return_date: row.return_date || row['Tanggal Kembali'] || null,
  };
};

export const importIncomingFromExcel = async (file: File): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    // Option 1: Send file to backend for processing
    const result = await inventoryApi.importIncomingGoods(file);
    return { success: true, count: result.count };
  } catch (err: any) {
    // Option 2: If backend doesn't support file upload, process client-side
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const cleanedData = jsonData.map(cleanIncomingData).filter(item => item.serial_number && item.item_name);

      if (cleanedData.length === 0) {
        return { success: false, count: 0, error: 'Tidak ada data valid untuk diimport' };
      }

      // Import each item
      let count = 0;
      for (const item of cleanedData) {
        await inventoryApi.createIncomingGoods(item);
        count++;
      }

      return { success: true, count };
    } catch (clientErr: any) {
      return { success: false, count: 0, error: clientErr.message || 'Gagal mengimport data' };
    }
  }
};

export const importOutgoingFromExcel = async (file: File): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    // Option 1: Send file to backend for processing
    const result = await inventoryApi.importOutgoingGoods(file);
    return { success: true, count: result.count };
  } catch (err: any) {
    // Option 2: If backend doesn't support file upload, process client-side
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const cleanedData = jsonData.map(cleanOutgoingData).filter(item => item.serial_number && item.item_name);

      if (cleanedData.length === 0) {
        return { success: false, count: 0, error: 'Tidak ada data valid untuk diimport' };
      }

      // Import each item
      let count = 0;
      for (const item of cleanedData) {
        await inventoryApi.createOutgoingGoods(item);
        count++;
      }

      return { success: true, count };
    } catch (clientErr: any) {
      return { success: false, count: 0, error: clientErr.message || 'Gagal mengimport data' };
    }
  }
};

export const exportIncomingToExcel = async (data: IncomingGoods[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Barang Masuk');
  XLSX.writeFile(workbook, `barang_masuk_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportOutgoingToExcel = async (data: OutgoingGoods[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Barang Keluar');
  XLSX.writeFile(workbook, `barang_keluar_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportCombinedToExcel = async () => {
  try {
    // Try to get blob from backend
    const blob = await exportApi.exportCombined();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_inventaris_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch {
    // Fallback: fetch data via API and generate client-side
    const incoming = await inventoryApi.getIncomingGoods({ limit: 10000 });
    const outgoing = await inventoryApi.getOutgoingGoods({ limit: 10000 });

    const workbook = XLSX.utils.book_new();
    
    const incomingSheet = XLSX.utils.json_to_sheet(incoming.data || []);
    XLSX.utils.book_append_sheet(workbook, incomingSheet, 'Barang Masuk');
    
    const outgoingSheet = XLSX.utils.json_to_sheet(outgoing.data || []);
    XLSX.utils.book_append_sheet(workbook, outgoingSheet, 'Barang Keluar');
    
    XLSX.writeFile(workbook, `laporan_inventaris_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
};

export const addIncomingItem = async (item: Partial<IncomingGoods>) => {
  try {
    const cleanedItem = cleanIncomingData(item);
    const data = await inventoryApi.createIncomingGoods(cleanedItem);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || error.message };
  }
};

export const addOutgoingItem = async (item: Partial<OutgoingGoods>) => {
  try {
    const cleanedItem = cleanOutgoingData(item);
    const data = await inventoryApi.createOutgoingGoods(cleanedItem);
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.response?.data?.message || error.message };
  }
};
