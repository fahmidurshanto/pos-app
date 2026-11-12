import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { lookupService } from '@/services/lookup-service';
import { ApiSubCategory, ApiCategory } from '@/types/api-types';

export const SubCategoryListScreen: React.FC = () => {
  const [subcats, setSubcats] = useState<ApiSubCategory[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subcatName, setSubcatName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('101');
  const [submitting, setSubmitting] = useState(false);

  const fetchSubCats = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        lookupService.getSubCategories(),
        lookupService.getCategories(),
      ]);
      if (subRes.data && Array.isArray(subRes.data)) {
        setSubcats(subRes.data);
      } else {
        setSubcats([]);
      }
      if (catRes.data && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
        if (catRes.data.length > 0) setSelectedCatId(catRes.data[0].id);
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

  const handleCreate = async () => {
    if (!subcatName.trim()) return;
    setSubmitting(true);
    try {
      // API 12: POST /api/v1/subcats
      const res = await lookupService.createSubCategory({
        subcat: subcatName.trim(),
        category_id: selectedCatId,
      });

      if (res.error === 'False' || res.code === '200') {
        setSubcatName('');
        setModalVisible(false);
        fetchSubCats();
      } else {
        Alert.alert('Notice', res.message || 'Saved');
        fetchSubCats();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <View>
            <Text className="text-slate-800 text-lg font-bold">Sub Categories (API 11-14)</Text>
            <Text className="text-slate-400 text-xs">Live sub-categories from backend</Text>
          </View>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-emerald-600 px-3.5 py-1.5 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={13} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Add Sub Category</Text>
          </Pressable>
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
                    <Text className="w-32 text-xs text-slate-700">{sc.category || 'SANITARY'}</Text>
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

      {/* Add Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl p-5 shadow-xl">
            <Text className="text-base font-bold text-slate-900 mb-2">Add Sub Category (API 12)</Text>
            
            <Text className="text-xs font-semibold text-slate-600 mb-1">Parent Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2 mb-3">
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setSelectedCatId(c.id)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    selectedCatId === c.id ? 'bg-emerald-600 border-emerald-600' : 'bg-slate-50 border-slate-300'
                  }`}>
                  <Text className={`text-xs ${selectedCatId === c.id ? 'text-white font-bold' : 'text-slate-700'}`}>
                    {c.category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text className="text-xs font-semibold text-slate-600 mb-1">Sub Category Name</Text>
            <TextInput
              value={subcatName}
              onChangeText={setSubcatName}
              placeholder="e.g. CONCIL KEY"
              placeholderTextColor="#94A3B8"
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 mb-4"
            />

            <View className="flex-row justify-end gap-2">
              <Pressable onPress={() => setModalVisible(false)} className="px-4 py-2 rounded-lg bg-slate-100">
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
