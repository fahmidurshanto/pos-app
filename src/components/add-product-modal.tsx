import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { ProductItem } from '@/constants/pos-data';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (product: Omit<ProductItem, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  const categories = ['Electronics', 'Accessories', 'Office', 'Furniture', 'Others'];

  const handleSubmit = () => {
    if (!name.trim()) return;

    const parsedStock = parseInt(stock || '0', 10);
    const parsedPrice = price.startsWith('$') ? price : `$${price || '0'}`;

    let status: ProductItem['status'] = 'In Stock';
    if (parsedStock === 0) status = 'Out of Stock';
    else if (parsedStock < 10) status = 'Low Stock';

    onAdd({
      name: name.trim(),
      sku: sku.trim() || `PRD-${Math.floor(100 + Math.random() * 900)}`,
      category,
      stock: parsedStock,
      price: parsedPrice,
      status,
    });

    // Reset and close
    setName('');
    setSku('');
    setStock('');
    setPrice('');
    onClose();
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
              <Text className="text-slate-400 text-xs">Enter product details</Text>
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
                placeholder="e.g. MacBook Pro 14&quot;"
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
                placeholder="e.g. PRD-001"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-mono"
              />
            </View>

            {/* Category selection */}
            <View className="mb-4">
              <Text className="text-xs font-semibold text-slate-700 mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {categories.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-[#4F46E5] border-[#4F46E5]'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-white' : 'text-slate-600'
                        }`}>
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Stock & Price Row */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-700 mb-1">Stock</Text>
                <TextInput
                  value={stock}
                  onChangeText={setStock}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-700 mb-1">Price ($)</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="25.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#94A3B8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800"
                />
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              className="bg-[#4F46E5] py-3.5 rounded-xl items-center active:bg-[#4338CA] shadow-md">
              <Text className="text-white text-sm font-bold">Save Product</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

