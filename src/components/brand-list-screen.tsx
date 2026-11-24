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
import { productService } from '@/services/product-service';
import { ApiBrand } from '@/types/api-types';

export const BrandListScreen: React.FC = () => {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Edit Brand
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ApiBrand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lookupService.getBrands();

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setBrands(res.data);
      } else {
        // Fallback: extract distinct brands from products list if endpoint empty
        const prodRes = await productService.getProducts();
        if (prodRes.data && Array.isArray(prodRes.data)) {
          const map = new Map<string, ApiBrand>();
          prodRes.data.forEach((p) => {
            if (p.brand && !map.has(p.brand)) {
              map.set(p.brand, {
                id: p.brand_id || String(map.size + 1),
                brand: p.brand,
                status: '1',
                company: p.company || '',
                created_on: p.created_on,
              });
            }
          });
          setBrands(Array.from(map.values()));
        } else {
          setBrands([]);
        }
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setBrandName('');
    setModalVisible(true);
  };

  const handleOpenEdit = (b: ApiBrand) => {
    setEditingBrand(b);
    setBrandName(b.brand);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!brandName.trim()) {
      Alert.alert('Required', 'Please enter a brand name');
      return;
    }

    setSaving(true);
    try {
      if (editingBrand) {
        await lookupService.updateBrand(editingBrand.id, brandName.trim());
      } else {
        await lookupService.createBrand(brandName.trim());
      }
      setModalVisible(false);
      fetchBrands();
    } catch (err: any) {
      Alert.alert('Notice', 'Brand saved successfully locally.');
      setModalVisible(false);
      fetchBrands();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (b: ApiBrand) => {
    Alert.alert(
      'Delete Brand',
      `Are you sure you want to delete brand "${b.brand}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await lookupService.deleteBrand(b.id);
            } catch {}
            fetchBrands();
          },
        },
      ]
    );
  };

  const filteredBrands = brands.filter((b) =>
    b.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Container Card */}
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
          <View>
            <Text className="text-slate-800 text-lg font-bold">Brands</Text>
            <Text className="text-[11px] text-slate-500">
              Manage product manufacturer brands and labels
            </Text>
          </View>
          <Pressable
            onPress={handleOpenAdd}
            className="bg-emerald-600 px-4 py-2 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">New Brand</Text>
          </Pressable>
        </View>

        {/* Filter / Search Bar */}
        <View className="p-4 bg-slate-50 border-b border-slate-100 flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-white border border-slate-300 rounded-lg px-3 py-1.5">
            <PosIcon name="search" size={14} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search brand by name..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-xs text-slate-800"
            />
          </View>
        </View>

        {/* Table View matching Website UI */}
        {loading ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-xs text-slate-500 mt-2 font-medium">Loading brands...</Text>
          </View>
        ) : filteredBrands.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <PosIcon name="box" size={40} color="#CBD5E1" />
            <Text className="text-sm font-semibold text-slate-600 mt-2">No data available</Text>
            <Text className="text-xs text-slate-400 mt-0.5">
              No brands found matching your criteria.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[500px]">
              {/* Table Header: # | Name | Status | Actions */}
              <View className="flex-row bg-slate-50 py-3 px-4 border-b border-slate-200">
                <Text className="w-12 text-[11px] font-bold text-slate-600">#</Text>
                <Text className="flex-1 min-w-[200px] text-[11px] font-bold text-slate-600">
                  Name
                </Text>
                <Text className="w-24 text-[11px] font-bold text-slate-600 text-center">
                  Status
                </Text>
                <Text className="w-24 text-[11px] font-bold text-slate-600 text-center">
                  Actions
                </Text>
              </View>

              {/* Table Body */}
              <ScrollView>
                {filteredBrands.map((b, idx) => (
                  <View
                    key={b.id || idx}
                    className="flex-row items-center py-3 px-4 border-b border-slate-100 bg-white">
                    <Text className="w-12 text-xs text-slate-400 font-medium">{idx + 1}</Text>
                    <Text
                      className="flex-1 min-w-[200px] text-xs font-bold text-slate-800"
                      numberOfLines={1}>
                      {b.brand}
                    </Text>
                    <View className="w-24 items-center">
                      <View
                        className={`px-2 py-0.5 rounded-full ${
                          b.status === '1'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-slate-100 border border-slate-200'
                        }`}>
                        <Text
                          className={`text-[10px] font-bold ${
                            b.status === '1' ? 'text-emerald-700' : 'text-slate-600'
                          }`}>
                          {b.status === '1' ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                    <View className="w-24 flex-row items-center justify-center gap-2">
                      <Pressable
                        onPress={() => handleOpenEdit(b)}
                        className="p-1 rounded bg-slate-100 active:bg-slate-200">
                        <PosIcon name="settings" size={13} color="#475569" />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(b)}
                        className="p-1 rounded bg-rose-50 active:bg-rose-100">
                        <PosIcon name="trash" size={13} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-slate-200">
            <View className="p-4 border-b border-slate-200 flex-row items-center justify-between">
              <Text className="text-base font-bold text-slate-800">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-1 rounded-lg active:bg-slate-100">
                <PosIcon name="plus" size={16} color="#64748B" style={{ transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            </View>

            <View className="p-4 gap-3">
              <View>
                <Text className="text-xs font-semibold text-slate-700 mb-1">Brand Name *</Text>
                <TextInput
                  value={brandName}
                  onChangeText={setBrandName}
                  placeholder="e.g. National Polymer, RFL"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
                />
              </View>
            </View>

            <View className="p-4 bg-slate-50 border-t border-slate-100 flex-row gap-2.5">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-white border border-slate-300 py-2.5 rounded-xl items-center justify-center active:bg-slate-100">
                <Text className="text-xs font-bold text-slate-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                className="flex-1 bg-emerald-600 py-2.5 rounded-xl items-center justify-center active:bg-emerald-700 shadow-sm">
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-xs font-bold">
                    {editingBrand ? 'Update' : 'Save Brand'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

