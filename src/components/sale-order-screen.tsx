import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ProductItem } from '@/constants/pos-data';
import { saleService } from '@/services/sale-service';
import { API_CONFIG } from '@/constants/api';

export interface SaleItemRow {
  productId: string;
  name: string;
  code: string;
  unit: string;
  rate: number;
  quantity: number;
  total: number;
}

interface SaleOrderScreenProps {
  products: ProductItem[];
  onOrderSubmitted?: () => void;
}

export const SaleOrderScreen: React.FC<SaleOrderScreenProps> = ({
  products = [],
  onOrderSubmitted,
}) => {
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  // Product search & date
  const [productQuery, setProductQuery] = useState('');
  const [orderDate] = useState('2026-11-12');

  // Order items in table
  const [orderItems, setOrderItems] = useState<SaleItemRow[]>([]);

  // Notes & Financials
  const [note, setNote] = useState('');
  const [discount, setDiscount] = useState('0');
  const [payment, setPayment] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  // Filtered products for quick-select
  const searchResults = productQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(productQuery.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product: ProductItem) => {
    const rateNum = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;

    setOrderItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.rate,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          code: product.sku,
          unit: 'Peace',
          rate: rateNum,
          quantity: 1,
          total: rateNum,
        },
      ];
    });

    setProductQuery('');
  };

  const updateQuantity = (productId: string, qtyStr: string) => {
    const qty = parseInt(qtyStr || '0', 10);
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            return qty > 0 ? { ...item, quantity: qty, total: qty * item.rate } : null;
          }
          return item;
        })
        .filter(Boolean) as SaleItemRow[]
    );
  };

  const updateRate = (productId: string, rateStr: string) => {
    const rate = parseFloat(rateStr || '0');
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, rate, total: rate * item.quantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Calculations
  const calculatedTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const discountNum = parseFloat(discount || '0');
  const paymentNum = parseFloat(payment || '0');
  const due = Math.max(calculatedTotal - discountNum - paymentNum, 0);

  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      // Dispatch to API /api/v1/sales
      await saleService.createSale({
        customer_name: customerName.trim() || 'Walk-in Customer',
        mobile: mobile.trim(),
        address: address.trim(),
        date: orderDate,
        note: note.trim(),
        items: orderItems.map((item) => ({
          product_id: item.productId,
          product: item.name,
          sku: item.code,
          unit: item.unit,
          rate: item.rate,
          qty: item.quantity,
          total: item.total,
        })),
        total_amount: calculatedTotal,
        discount: discountNum,
        payment: paymentNum,
        due,
        company: API_CONFIG.DEFAULT_COMPANY,
      });

      // Reset form state
      setOrderItems([]);
      setCustomerName('');
      setMobile('');
      setAddress('');
      setNote('');
      setDiscount('0');
      setPayment('0');

      // Navigate back to Sales List
      if (onOrderSubmitted) {
        onOrderSubmitted();
      }
    } catch (error) {
      console.error('Failed to submit sale order:', error);
      if (onOrderSubmitted) {
        onOrderSubmitted();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5">
        {/* Title */}
        <Text className="text-slate-800 text-lg font-bold pb-4 border-b border-slate-200 mb-4">
          Sale Order
        </Text>

        {/* 1. Customer Info Row */}
        <View className="flex-col gap-3 mb-4">
          <View className="flex-row gap-3">
            {/* Name */}
            <View className="flex-1">
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Name"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Mobile */}
            <View className="w-40">
              <TextInput
                value={mobile}
                onChangeText={setMobile}
                placeholder="Mobile"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800"
              />
            </View>
          </View>

          {/* Address */}
          <View>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              multiline
              numberOfLines={2}
              placeholderTextColor="#94A3B8"
              className="bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 h-14 text-top"
            />
          </View>
        </View>

        {/* 2. Product Search & Date */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-slate-700 mb-1">
            Select Product (Search by Name or Code)
          </Text>
          <View className="flex-row gap-2">
            {/* Product search box */}
            <View className="flex-1">
              <TextInput
                value={productQuery}
                onChangeText={setProductQuery}
                placeholder="Type product name or scan code..."
                placeholderTextColor="#94A3B8"
                className="bg-white border-2 border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 shadow-sm"
              />
            </View>

            {/* Date Picker / Value */}
            <View className="w-28 bg-slate-100 border border-slate-300 rounded-lg px-2 py-2 items-center justify-center">
              <Text className="text-xs font-semibold text-slate-700">{orderDate}</Text>
            </View>
          </View>

          {/* Quick Select Buttons from Live Products */}
          <View className="mt-2.5">
            <Text className="text-[11px] font-medium text-slate-500 mb-1.5">
              {searchResults.length > 0 ? 'Search Results:' : 'Available Products (Tap to Add):'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {(searchResults.length > 0 ? searchResults : products).map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => handleSelectProduct(p)}
                  className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 min-w-[130px] active:bg-emerald-50 active:border-emerald-500 shadow-xs">
                  <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text className="text-[10px] text-slate-400 font-mono">
                    {p.sku} | Stock: {p.stock}
                  </Text>
                  <Text className="text-xs font-bold text-emerald-600 mt-1">{p.price}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 3. Items Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="min-w-[620px] border border-slate-200 rounded-lg overflow-hidden mt-2">
            {/* Table Header */}
            <View className="flex-row bg-slate-50 border-b border-slate-200 py-2.5 px-3">
              <Text className="w-8 text-[11px] font-bold text-slate-700">#</Text>
              <Text className="w-40 text-[11px] font-bold text-slate-700">Product</Text>
              <Text className="w-24 text-[11px] font-bold text-slate-700">Code</Text>
              <Text className="w-16 text-[11px] font-bold text-slate-700">Unit</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Rate</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Quantity</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Total</Text>
              <Text className="w-12 text-[11px] font-bold text-slate-700"></Text>
            </View>

            {/* Table Rows */}
            {orderItems.length === 0 ? (
              <View className="p-4 items-center justify-center">
                <Text className="text-xs text-slate-400">
                  Search & select product above to add items to table.
                </Text>
              </View>
            ) : (
              orderItems.map((item, idx) => (
                <View
                  key={item.productId}
                  className="flex-row items-center py-2 px-3 border-b border-slate-100">
                  <Text className="w-8 text-xs text-slate-500">{idx + 1}</Text>
                  <Text className="w-40 text-xs font-bold text-slate-800" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="w-24 text-xs text-slate-500 font-mono">{item.code}</Text>
                  <Text className="w-16 text-xs text-slate-600">{item.unit}</Text>
                  <View className="w-20 pr-2">
                    <TextInput
                      value={String(item.rate)}
                      onChangeText={(val) => updateRate(item.productId, val)}
                      keyboardType="numeric"
                      className="border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </View>
                  <View className="w-20 pr-2">
                    <TextInput
                      value={String(item.quantity)}
                      onChangeText={(val) => updateQuantity(item.productId, val)}
                      keyboardType="numeric"
                      className="border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 text-center"
                    />
                  </View>
                  <Text className="w-20 text-xs font-bold text-slate-900">
                    ${item.total.toFixed(2)}
                  </Text>
                  <Pressable
                    onPress={() => removeItem(item.productId)}
                    className="w-12 items-center">
                    <Text className="text-rose-500 text-xs font-bold">✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* 4. Notes (Left) & Financials (Right) */}
        <View className="flex-col md:flex-row gap-4 mb-4">
          {/* Note section */}
          <View className="flex-1">
            <Text className="text-xs font-semibold text-slate-700 mb-1">Any Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Note"
              multiline
              numberOfLines={4}
              placeholderTextColor="#94A3B8"
              className="bg-white border border-slate-300 rounded-md p-3 text-xs text-slate-800 h-28 text-top"
            />
          </View>

          {/* Calculations Box */}
          <View className="w-full md:w-64 border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
            {/* Total */}
            <View className="flex-row items-center justify-between p-2.5 bg-slate-50">
              <Text className="text-xs font-bold text-slate-700">Total</Text>
              <Text className="text-xs font-bold text-slate-900">
                {calculatedTotal.toFixed(1)}
              </Text>
            </View>

            {/* Discount */}
            <View className="flex-row items-center justify-between p-2 bg-white">
              <Text className="text-xs font-semibold text-slate-700">Discount</Text>
              <TextInput
                value={discount}
                onChangeText={setDiscount}
                placeholder="0"
                keyboardType="numeric"
                className="w-24 border border-slate-300 rounded px-2 py-1 text-right text-xs text-slate-800"
              />
            </View>

            {/* Payment */}
            <View className="flex-row items-center justify-between p-2 bg-white">
              <Text className="text-xs font-semibold text-slate-700">Payment</Text>
              <TextInput
                value={payment}
                onChangeText={setPayment}
                placeholder="Payment"
                keyboardType="numeric"
                className="w-24 border border-slate-300 rounded px-2 py-1 text-right text-xs text-slate-800"
              />
            </View>

            {/* Due */}
            <View className="flex-row items-center justify-between p-2.5 bg-slate-50">
              <Text className="text-xs font-bold text-slate-700">Due</Text>
              <Text className="text-xs font-bold text-rose-600">{due.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* 5. Submit Button */}
        <Pressable
          disabled={submitting}
          onPress={handleSubmit}
          className="bg-emerald-600 px-6 py-2.5 rounded-lg self-start active:bg-emerald-700 shadow-sm flex-row items-center gap-2">
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-xs font-bold tracking-wider">Submit</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

