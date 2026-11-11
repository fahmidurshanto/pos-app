import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { supplierService } from '@/services/supplier-service';
import { ApiSupplier } from '@/types/api-types';

export const SupplierListScreen: React.FC = () => {
  const [suppliers, setSuppliers] = useState<ApiSupplier[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supplierService.getSuppliers();
      if (res.data && Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        setSuppliers([]);
      }
    } catch {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        <View className="pb-3 border-b border-slate-200 mb-3">
          <Text className="text-slate-800 text-lg font-bold">Suppliers (API 3-6)</Text>
          <Text className="text-slate-400 text-xs">Live suppliers list from backend</Text>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading suppliers from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[550px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700">#</Text>
                <Text className="w-40 text-[11px] font-bold text-slate-700">Supplier Name</Text>
                <Text className="w-28 text-[11px] font-bold text-slate-700">Mobile</Text>
                <Text className="w-36 text-[11px] font-bold text-slate-700">Email</Text>
                <Text className="w-48 text-[11px] font-bold text-slate-700">Address</Text>
              </View>

              {suppliers.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No suppliers found in API.</Text>
                </View>
              ) : (
                suppliers.map((s, idx) => (
                  <View key={s.id || idx} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">{idx + 1}</Text>
                    <Text className="w-40 text-xs font-bold text-slate-800">{s.supplier}</Text>
                    <Text className="w-28 text-xs text-slate-600 font-mono">{s.mobile}</Text>
                    <Text className="w-36 text-xs text-slate-600">{s.email}</Text>
                    <Text className="w-48 text-xs text-slate-500">{s.address}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

