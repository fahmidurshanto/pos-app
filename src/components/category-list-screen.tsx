import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { lookupService } from '@/services/lookup-service';
import { ApiCategory } from '@/types/api-types';

export const CategoryListScreen: React.FC = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lookupService.getCategories();
      if (res.data && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async () => {
    if (!categoryName.trim()) return;
    setSubmitting(true);
    try {
      const res = await lookupService.createCategory(categoryName.trim());
      if (res.error === 'False' || res.code === '200') {
        setCategoryName('');
        setNewModalVisible(false);
        fetchCategories();
      } else {
        Alert.alert('Notice', res.message || 'Category saved');
        fetchCategories();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <View>
            <Text className="text-slate-800 text-lg font-bold">Categories (API 7-10)</Text>
            <Text className="text-slate-400 text-xs">Live category management</Text>
          </View>
          <Pressable
            onPress={() => setNewModalVisible(true)}
            className="bg-emerald-600 px-3.5 py-1.5 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={13} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Add Category</Text>
          </Pressable>
        </View>

        {/* Content Table */}
        {loading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading categories from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[500px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700"># ID</Text>
                <Text className="w-44 text-[11px] font-bold text-slate-700">Category Name</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Company</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Status</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Created On</Text>
              </View>

              {categories.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No categories found in API.</Text>
                </View>
              ) : (
                categories.map((c) => (
                  <View key={c.id} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">#{c.id}</Text>
                    <Text className="w-44 text-xs font-bold text-slate-800">{c.category}</Text>
                    <Text className="w-24 text-xs text-slate-600">{c.company}</Text>
                    <View className="w-24">
                      <View className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full self-start">
                        <Text className="text-[10px] text-emerald-700 font-semibold">Active</Text>
                      </View>
                    </View>
                    <Text className="w-24 text-[10px] text-slate-400">{c.created_on?.split(' ')[0] || 'N/A'}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Add Modal */}
      <Modal visible={newModalVisible} transparent animationType="fade" onRequestClose={() => setNewModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl p-5 shadow-xl">
            <Text className="text-base font-bold text-slate-900 mb-3">Add Category (API 8)</Text>
            <TextInput
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="e.g. SANITARY or TAILS"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 mb-4"
            />
            <View className="flex-row justify-end gap-2">
              <Pressable onPress={() => setNewModalVisible(false)} className="px-4 py-2 rounded-lg bg-slate-100">
                <Text className="text-xs text-slate-600 font-semibold">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreate} disabled={submitting} className="px-4 py-2 rounded-lg bg-emerald-600 active:bg-emerald-700">
                {submitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text className="text-xs text-white font-bold">Save</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

