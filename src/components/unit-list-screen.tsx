import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { lookupService } from '@/services/lookup-service';
import { ApiUnit } from '@/types/api-types';

export const UnitListScreen: React.FC = () => {
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lookupService.getUnits();
      if (res.data && Array.isArray(res.data)) {
        setUnits(res.data);
      } else {
        setUnits([]);
      }
    } catch {
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        <View className="pb-3 border-b border-slate-200 mb-3">
          <Text className="text-slate-800 text-lg font-bold">Units of Measure (API 15-18)</Text>
          <Text className="text-slate-400 text-xs">Live units retrieved from backend</Text>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading units from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[450px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700"># ID</Text>
                <Text className="w-36 text-[11px] font-bold text-slate-700">Unit</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Quantity</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Company</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Status</Text>
              </View>

              {units.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No units found in API.</Text>
                </View>
              ) : (
                units.map((u) => (
                  <View key={u.id} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">#{u.id}</Text>
                    <Text className="w-36 text-xs font-bold text-slate-800">{u.unit}</Text>
                    <Text className="w-20 text-xs text-slate-600 font-mono">{u.qty}</Text>
                    <Text className="w-24 text-xs text-slate-600">{u.company}</Text>
                    <View className="w-20">
                      <View className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full self-start">
                        <Text className="text-[10px] text-emerald-700 font-semibold">Active</Text>
                      </View>
                    </View>
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

