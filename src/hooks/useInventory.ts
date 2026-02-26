import { useState, useEffect, useCallback } from 'react';
import { inventoryApi, dashboardApi, DashboardStats, ChartDataPoint, OwnershipDataPoint } from '@/services/api';
import { IncomingGoods, OutgoingGoods } from '@/types/inventory';

interface UseInventoryOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export const useIncomingGoods = (options: UseInventoryOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  const [data, setData] = useState<IncomingGoods[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inventoryApi.getIncomingGoods({ page, limit, search });
      setData(response.data as IncomingGoods[]);
      setTotalCount(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, totalCount, totalPages: Math.ceil(totalCount / limit), loading, error, refetch: fetchData };
};

export const useOutgoingGoods = (options: UseInventoryOptions = {}) => {
  const { page = 1, limit = 10, search = '' } = options;
  const [data, setData] = useState<OutgoingGoods[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inventoryApi.getOutgoingGoods({ page, limit, search });
      setData(response.data as OutgoingGoods[]);
      setTotalCount(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, totalCount, totalPages: Math.ceil(totalCount / limit), loading, error, refetch: fetchData };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);

    try {
      const response = await dashboardApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};

export const useChartData = (months: number = 6) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await dashboardApi.getChartData(months);
      setData(response);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { data, loading, refetch: fetchChartData };
};

export const useOwnershipData = () => {
  const [data, setData] = useState<OwnershipDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnershipData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await dashboardApi.getOwnershipData();
      setData(response);
    } catch (err) {
      console.error('Error fetching ownership data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnershipData();
  }, [fetchOwnershipData]);

  return { data, loading, refetch: fetchOwnershipData };
};
