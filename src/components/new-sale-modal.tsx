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
import { ProductItem } from '@/constants/pos-data';

export interface CartItem extends ProductItem {
  quantity: number;
}

interface NewSaleModalProps {
  visible: boolean;
  onClose: () => void;
  products?: ProductItem[];
  onCompleteSale: (total: number, items: CartItem[], customerName: string) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  visible,
  onClose,
  products = [],
  onCompleteSale,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Mobile Pay'>('Cash');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const priceNum = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
      return sum + priceNum * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleFinish = () => {
    if (cart.length === 0) return;
    onCompleteSale(total, cart, customerName);
    setCart([]);
    setCustomerName('');
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/60">
        <View className="bg-white rounded-t-3xl max-h-[92%] p-5 shadow-2xl flex-1 mt-14">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
            <View>
              <Text className="text-slate-900 text-lg font-bold">New Sale Checkout</Text>
              <Text className="text-slate-400 text-xs">
                Select items from live products API
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center active:bg-slate-200">
              <Text className="text-slate-600 font-bold text-sm">✕</Text>
            </Pressable>
          </View>

          <ScrollView className="flex-1 py-3" showsVerticalScrollIndicator={false}>
            {/* Customer input */}
            <View className="mb-3">
              <Text className="text-xs font-semibold text-slate-700 mb-1">
                Customer Name / Phone
              </Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Walk-in Customer / Phone"
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
              />
            </View>

            {/* Search products */}
            <View className="mb-3">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search products by name, SKU or category..."
                placeholderTextColor="#94A3B8"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Quick Product Add from Live API */}
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-xs font-semibold text-slate-700">
                Products from Live API ({filteredProducts.length})
              </Text>
            </View>

            {filteredProducts.length === 0 ? (
              <View className="py-4 items-center justify-center bg-slate-50 rounded-xl mb-4 border border-dashed border-slate-200">
                <Text className="text-xs text-slate-400">No products found</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2 mb-4">
                {filteredProducts.map((prod) => (
                  <Pressable
                    key={prod.id}
                    onPress={() => addToCart(prod)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[130px] active:bg-emerald-50 active:border-emerald-300">
                    <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>
                      {prod.name}
                    </Text>
                    <Text className="text-[10px] text-slate-400 font-mono">{prod.sku}</Text>
                    <Text className="text-xs font-bold text-emerald-600 mt-2">{prod.price}</Text>
                    <Text className="text-[9px] text-slate-400 mt-0.5">Stock: {prod.stock}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Order Items Table */}
            <Text className="text-xs font-semibold text-slate-700 mb-2">
              Cart Items ({cart.length})
            </Text>
            {cart.length === 0 ? (
              <View className="py-6 items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 mb-4">
                <Text className="text-xs text-slate-400">Cart is empty. Tap an item above.</Text>
              </View>
            ) : (
              <View className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 mb-4">
                {cart.map((item) => (
                  <View key={item.id} className="flex-row items-center justify-between p-3 bg-white">
                    <View className="flex-1 pr-2">
                      <Text className="text-xs font-bold text-slate-800">{item.name}</Text>
                      <Text className="text-[10px] text-slate-400">{item.price} each</Text>
                    </View>

                    {/* Quantity controls */}
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-slate-100 items-center justify-center">
                        <Text className="font-bold text-slate-600">-</Text>
                      </Pressable>
                      <Text className="text-xs font-bold text-slate-800 w-5 text-center">
                        {item.quantity}
                      </Text>
                      <Pressable
                        onPress={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-slate-100 items-center justify-center">
                        <Text className="font-bold text-slate-600">+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Payment Method */}
            <Text className="text-xs font-semibold text-slate-700 mb-2">Payment Method</Text>
            <View className="flex-row gap-2 mb-4">
              {(['Cash', 'Card', 'Mobile Pay'] as const).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <Pressable
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    className={`flex-1 py-2 rounded-xl border items-center ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-slate-600'
                      }`}>
                      {method}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Summary */}
            <View className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-xs text-slate-500">Subtotal</Text>
                <Text className="text-xs text-slate-700 font-medium">
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs text-slate-500">Tax (5%)</Text>
                <Text className="text-xs text-slate-700 font-medium">${tax.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between pt-2 border-t border-slate-200">
                <Text className="text-sm font-bold text-slate-900">Total Amount</Text>
                <Text className="text-sm font-bold text-emerald-600">${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout CTA */}
          <Pressable
            disabled={cart.length === 0}
            onPress={handleFinish}
            className={`py-3.5 rounded-xl items-center shadow-md ${
              cart.length === 0 ? 'bg-slate-300' : 'bg-emerald-600 active:bg-emerald-700'
            }`}>
            <Text className="text-white text-sm font-bold">
              Complete Sale • ${total.toFixed(2)}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
