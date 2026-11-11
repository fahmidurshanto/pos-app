import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { lookupService } from '@/services/lookup-service';
import { ApiSubCategory } from '@/types/api-types';

export const SubCategoryListScreen: React.FC = () => {
  const [subcats, setSubcats] = useState<ApiSubCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubCats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lookupService.getSubCategories();
      if (res.data && Array.isArray(res.data)) {
        setSubcats(res.data);
      } else {
        setSubcats([]);
      }
    } catch {
      setSubcats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubCats();
  }, [fetchSubCats]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        <View className="pb-3 border-b border-slate-200 mb-3">
          <Text className="text-slate-800 text-lg font-bold">Sub Categories (API 11-14)</Text>
          <Text className="text-slate-400 text-xs">Live sub-categories from backend</Text>
        </View>

        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading sub-categories from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[500px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700"># ID</Text>
                <Text className="w-40 text-[11px] font-bold text-slate-700">Sub Category</Text>
                <Text className="w-32 text-[11px] font-bold text-slate-700">Parent Category</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Company</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Status</Text>
              </View>

              {subcats.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No sub-categories found in API.</Text>
                </View>
              ) : (
                subcats.map((sc) => (
                  <View key={sc.id} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">#{sc.id}</Text>
                    <Text className="w-40 text-xs font-bold text-slate-800">{sc.subcat}</Text>
                    <Text className="w-32 text-xs text-slate-700">{sc.category || 'N/A'}</Text>
                    <Text className="w-20 text-xs text-slate-600">{sc.company}</Text>
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

