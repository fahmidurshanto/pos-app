import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { productService } from '@/services/product-service';
import { ApiProduct } from '@/types/api-types';

interface ProductListScreenProps {
  onOpenAddModal: () => void;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({
  onOpenAddModal,
}) => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts(undefined, searchName.trim() || undefined);
      if (res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = (rowId: string, name: string) => {
    Alert.alert('Delete Product', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await productService.deleteProduct(rowId);
            fetchProducts();
          } catch {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <View>
            <Text className="text-slate-800 text-lg font-bold">Products List (API 19-22)</Text>
            <Text className="text-slate-400 text-xs">Live products inventory management</Text>
          </View>
          <Pressable
            onPress={onOpenAddModal}
            className="bg-emerald-600 px-3.5 py-1.5 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={13} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Add Product</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View className="flex-row gap-2 mb-3">
          <View className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5">
            <TextInput
              value={searchName}
              onChangeText={setSearchName}
              placeholder="Search by product name..."
              placeholderTextColor="#94A3B8"
              className="text-xs text-slate-800 p-0"
            />
          </View>
          <Pressable
            onPress={fetchProducts}
            className="bg-emerald-600 px-4 py-1.5 rounded-lg active:bg-emerald-700 items-center justify-center">
            <Text className="text-white text-xs font-bold">Search</Text>
          </Pressable>
        </View>

        {/* Content Table */}
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="small" color="#059669" />
            <Text className="text-xs text-slate-400 mt-2">Loading products from API...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[680px]">
              <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-2.5 px-3">
                <Text className="w-12 text-[11px] font-bold text-slate-700"># ID</Text>
                <Text className="w-44 text-[11px] font-bold text-slate-700">Product Name</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-700">Code / SKU</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Unit</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Buy Price</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-700">Sale Price</Text>
                <Text className="w-16 text-[11px] font-bold text-slate-700">Stock</Text>
                <Text className="w-16 text-[11px] font-bold text-slate-700">Action</Text>
              </View>

              {products.length === 0 ? (
                <View className="p-4">
                  <Text className="text-xs text-slate-400">No products found in API.</Text>
                </View>
              ) : (
                products.map((p) => (
                  <View key={p.id} className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                    <Text className="w-12 text-xs font-mono text-slate-500">#{p.id}</Text>
                    <Text className="w-44 text-xs font-bold text-slate-800" numberOfLines={1}>
                      {p.product}
                    </Text>
                    <Text className="w-24 text-xs font-mono text-slate-600">{p.sku}</Text>
                    <Text className="w-20 text-xs text-slate-600">{p.unit || 'Peace'}</Text>
                    <Text className="w-20 text-xs text-slate-500">${p.buy_price || '0'}</Text>
                    <Text className="w-20 text-xs font-bold text-emerald-600">${p.sale_price || '0'}</Text>
                    <Text className="w-16 text-xs text-slate-700 font-semibold">{p.stock || 0}</Text>
                    <Pressable
                      onPress={() => handleDelete(p.id, p.product)}
                      className="w-16">
                      <Text className="text-xs text-rose-500 font-semibold">Delete</Text>
                    </Pressable>
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

