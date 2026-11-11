import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { lookupService } from '@/services/lookup-service';
import { ApiCategory, ApiUnit } from '@/types/api-types';

export interface NewProductFormData {
  product: string;
  sku: string;
  category_id: string;
  category_name?: string;
  unit_id: string;
  buy_price: string;
  sale_price: string;
  stock: number;
}

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (product: NewProductFormData) => Promise<void> | void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [units, setUnits] = useState<ApiUnit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingLookups, setLoadingLookups] = useState(false);

  useEffect(() => {
    if (visible) {
      loadLookups();
    }
  }, [visible]);

  const loadLookups = async () => {
    setLoadingLookups(true);
    try {
      const [catRes, unitRes] = await Promise.all([
        lookupService.getCategories(),
        lookupService.getUnits(),
      ]);

      if (catRes.data && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
        if (catRes.data.length > 0) setSelectedCategory(catRes.data[0].id);
      }
      if (unitRes.data && Array.isArray(unitRes.data)) {
        setUnits(unitRes.data);
        if (unitRes.data.length > 0) setSelectedUnit(unitRes.data[0].id);
      }
    } finally {
      setLoadingLookups(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const categoryObj = categories.find((c) => c.id === selectedCategory);

      await onAdd({
        product: name.trim(),
        sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category_id: selectedCategory || '101',
        category_name: categoryObj?.category || 'General',
        unit_id: selectedUnit || '9',
        buy_price: buyPrice || '0',
        sale_price: salePrice || '0',
        stock: parseInt(stock || '0', 10),
      });

      // Reset & Close
      setName('');
      setSku('');
      setBuyPrice('');
      setSalePrice('');
      setStock('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[90%] p-6 shadow-xl">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-slate-100">
            <View>
              <Text className="text-slate-900 text-lg font-bold">Add New Product</Text>
              <Text className="text-slate-400 text-xs">Enter product & inventory details</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200">
              <Text className="text-slate-500 font-bold text-sm">✕</Text>
            </Pressable>
          </View>

          <ScrollView className="py-4" showsVerticalScrollIndicator={false}>
            {/* Product Name */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                Product Name *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Sanitary Pipe"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
              />
            </View>

            {/* SKU */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                SKU (Stock Keeping Unit)
              </Text>
              <TextInput
                value={sku}
                onChangeText={setSku}
                placeholder="e.g. PRD-101"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono"
              />
            </View>

            {/* Category selection from API */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-2">
                Category (API)
              </Text>
              {loadingLookups ? (
                <ActivityIndicator size="small" color="#059669" />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg border ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                        <Text
                          className={`text-xs font-medium ${
                            isSelected ? 'text-white' : 'text-slate-600'
                          }`}>
                          {cat.category}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* Units selection from API */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-2">
                Unit of Measure (API)
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {units.map((u) => {
                  const isSelected = selectedUnit === u.id;
                  return (
                    <Pressable
                      key={u.id}
                      onPress={() => setSelectedUnit(u.id)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-white' : 'text-slate-600'
                        }`}>
                        {u.unit}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Buy & Sale Price Row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-700 mb-1">Buy Price</Text>
                <TextInput
                  value={buyPrice}
                  onChangeText={setBuyPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-700 mb-1">Sale Price</Text>
                <TextInput
                  value={salePrice}
                  onChangeText={setSalePrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                />
              </View>
            </View>

            {/* Initial Stock */}
            <View className="mb-6">
              <Text className="text-xs font-semibold text-slate-700 mb-1">Stock Quantity</Text>
              <TextInput
                value={stock}
                onChangeText={setStock}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
              />
            </View>

            {/* Submit Button */}
            <Pressable
              disabled={submitting}
              onPress={handleSubmit}
              className="bg-emerald-600 py-3.5 rounded-xl items-center active:bg-emerald-700 shadow-md">
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-sm font-bold">Save Product (API)</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
