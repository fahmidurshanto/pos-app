import React, { useState, useEffect } from 'react';
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
import { purchaseService } from '@/services/purchase-service';
import { supplierService } from '@/services/supplier-service';
import { productService } from '@/services/product-service';
import { lookupService } from '@/services/lookup-service';
import { ApiSupplier, ApiProduct, ApiUnit } from '@/types/api-types';
import { useAuth } from '@/context/auth-context';

export interface PurchaseItemRow {
  productId: string;
  name: string;
  sku: string;
  brand: string;
  unit: string;
  quantity: number;
  rate: number;
  salePrice: number;
  total: number;
}

interface PurchaseOrderScreenProps {
  onOrderSubmitted?: () => void;
  onBackToList?: () => void;
}

export const PurchaseOrderScreen: React.FC<PurchaseOrderScreenProps> = ({
  onOrderSubmitted,
  onBackToList,
}) => {
  const { user } = useAuth();

  // Suppliers & Catalog data
  const [suppliers, setSuppliers] = useState<ApiSupplier[]>([]);
  const [productsList, setProductsList] = useState<ApiProduct[]>([]);
  const [unitsList, setUnitsList] = useState<ApiUnit[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form Header State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poDate, setPoDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [remark, setRemark] = useState('');

  // Items Grid State
  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [productQuery, setProductQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Financials
  const [payment, setPayment] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Lookups (Suppliers, Products, Units)
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [supRes, prodRes, unitRes] = await Promise.all([
          supplierService.getSuppliers(),
          productService.getProducts(),
          lookupService.getUnits(),
        ]);
        if (supRes.data && Array.isArray(supRes.data)) {
          setSuppliers(supRes.data);
          if (supRes.data.length > 0) {
            setSelectedSupplierId(String(supRes.data[0].id || supRes.data[0].RowID || ''));
          }
        }
        if (prodRes.data && Array.isArray(prodRes.data)) {
          setProductsList(prodRes.data);
        }
        if (unitRes.data && Array.isArray(unitRes.data)) {
          setUnitsList(unitRes.data);
        }
      } catch (err) {
        console.error('Failed to load purchase lookups:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadLookups();
  }, []);

  // Add Product Row
  const handleSelectProduct = (prod: ApiProduct) => {
    const defaultRate = parseFloat(prod.buy_price || '0');
    const defaultSale = parseFloat(prod.sale_price || '0');
    const newItem: PurchaseItemRow = {
      productId: String(prod.id),
      name: prod.product,
      sku: prod.sku || '',
      brand: prod.brand || prod.brand_id || '',
      unit: prod.unit || prod.unit_id || 'Pcs',
      quantity: 1,
      rate: defaultRate,
      salePrice: defaultSale,
      total: defaultRate * 1,
    };

    setItems((prev) => [...prev, newItem]);
    setProductQuery('');
    setShowProductDropdown(false);
  };

  // Add Blank/Manual Row
  const handleAddBlankRow = () => {
    const newItem: PurchaseItemRow = {
      productId: '',
      name: '',
      sku: '',
      brand: '',
      unit: unitsList[0]?.unit || 'Pcs',
      quantity: 1,
      rate: 0,
      salePrice: 0,
      total: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Update Item Fields
  const updateItem = (index: number, updates: Partial<PurchaseItemRow>) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const updated = { ...item, ...updates };
          updated.total = updated.quantity * updated.rate;
          return updated;
        }
        return item;
      })
    );
  };

  // Remove Item Row
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Financial Calculations
  const calculatedTotal = items.reduce((sum, item) => sum + item.total, 0);
  const paymentNum = parseFloat(payment || '0');
  const calculatedDue = Math.max(calculatedTotal - paymentNum, 0);

  // Submit Purchase Order
  const handleSubmit = async () => {
    if (!selectedSupplierId) {
      Alert.alert('Required', 'Please select a supplier.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Required', 'Please add at least one product item.');
      return;
    }

    setSubmitting(true);
    try {
      // Parallel arrays payload required by API 24
      const payload = {
        supplier_id: selectedSupplierId,
        date: `${poDate} 00:00:00`,
        note: remark.trim() || 'Purchase Order',
        paid: String(paymentNum.toFixed(2)),
        Due: String(calculatedDue.toFixed(2)),
        user_id: user?.id || '361',
        products: {
          product_id: items.map((it) => it.productId || ''),
          product: items.map((it) => it.name || 'Item'),
          sku: items.map((it) => it.sku || ''),
          brands: items.map((it) => it.brand || ''),
          units: items.map((it) => it.unit || ''),
          qty: items.map((it) => String(it.quantity)),
          rate: items.map((it) => String(it.rate)),
          sale: items.map((it) => String(it.salePrice)),
          total: items.map((it) => String(it.total.toFixed(2))),
        },
      };

      const res = await purchaseService.createPurchase(payload);

      if (res.error === 'False' || res.code === '200' || res.NewID) {
        const newId = res.NewID || res.RowID;
        // Optionally post to accounts (API 27)
        if (newId) {
          try {
            await purchaseService.postToAccount(newId, user?.id);
          } catch (postErr) {
            console.warn('postToAccount warning:', postErr);
          }
        }

        Alert.alert('Success', 'Purchase order created successfully!');
        if (onOrderSubmitted) {
          onOrderSubmitted();
        } else if (onBackToList) {
          onBackToList();
        }
      } else {
        Alert.alert('Error', res.message || 'Failed to create purchase order');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = productQuery.trim()
    ? productsList.filter(
        (p) =>
          p.product?.toLowerCase().includes(productQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(productQuery.toLowerCase())
      )
    : [];

  return (
    <ScrollView className="flex-1 bg-[#F8FAFC]">
      {/* Header Container */}
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
          <View className="flex-row items-center gap-2">
            {onBackToList && (
              <Pressable
                onPress={onBackToList}
                className="p-1.5 rounded-lg bg-slate-100 active:bg-slate-200">
                <PosIcon name="arrow-left" size={16} color="#334155" />
              </Pressable>
            )}
            <Text className="text-slate-800 text-lg font-bold">Product Purchase Order</Text>
          </View>
        </View>

        {/* Master Details Section */}
        <View className="p-4 bg-slate-50 border-b border-slate-200 flex-col gap-4">
          {/* Supplier Dropdown / Selector */}
          <View>
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">Supplier</Text>
            {loadingData ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2 py-1">
                {suppliers.map((sup) => {
                  const sId = String(sup.id || sup.RowID);
                  const isSelected = selectedSupplierId === sId;
                  return (
                    <Pressable
                      key={sId}
                      onPress={() => setSelectedSupplierId(sId)}
                      className={`px-3 py-2 rounded-lg border ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500'
                          : 'bg-white border-slate-300 active:bg-slate-100'
                      }`}>
                      <Text
                        className={`text-xs font-medium ${
                          isSelected ? 'text-emerald-700 font-bold' : 'text-slate-700'
                        }`}>
                        {sup.supplier}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* PO Date & Remark */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-slate-700 mb-1">PO Date</Text>
              <TextInput
                value={poDate}
                onChangeText={setPoDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-slate-700 mb-1">Remark</Text>
              <TextInput
                value={remark}
                onChangeText={setRemark}
                placeholder="Remark / Note"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>
          </View>

          {/* Product Quick-Search Input */}
          <View className="relative">
            <Text className="text-xs font-semibold text-slate-700 mb-1">Search & Add Product</Text>
            <View className="flex-row items-center bg-white border border-slate-300 rounded-lg px-3 py-1.5">
              <PosIcon name="search" size={14} color="#94A3B8" />
              <TextInput
                value={productQuery}
                onChangeText={(text) => {
                  setProductQuery(text);
                  setShowProductDropdown(text.trim().length > 0);
                }}
                onFocus={() => {
                  if (productQuery.trim().length > 0) setShowProductDropdown(true);
                }}
                placeholder="Type product name or SKU..."
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-2 text-xs text-slate-800"
              />
              <Pressable
                onPress={handleAddBlankRow}
                className="bg-rose-50 border border-rose-200 px-2 py-1 rounded flex-row items-center gap-1 active:bg-rose-100">
                <PosIcon name="plus" size={12} color="#E11D48" />
                <Text className="text-[11px] font-bold text-rose-600">Custom Row</Text>
              </Pressable>
            </View>

            {/* Dropdown Suggestions */}
            {showProductDropdown && filteredProducts.length > 0 && (
              <View className="mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 z-50 overflow-hidden">
                <ScrollView nestedScrollEnabled>
                  {filteredProducts.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => handleSelectProduct(p)}
                      className="px-3 py-2 border-b border-slate-100 active:bg-emerald-50 flex-row justify-between items-center">
                      <View className="flex-1 pr-2">
                        <Text className="text-xs font-semibold text-slate-800" numberOfLines={1}>
                          {p.product}
                        </Text>
                        <Text className="text-[10px] text-slate-500">
                          SKU: {p.sku || '-'} | Unit: {p.unit || '-'}
                        </Text>
                      </View>
                      <Text className="text-xs font-bold text-emerald-600">
                        ${p.buy_price || '0'}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Products Order Table */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-bold text-slate-800">
              Order Items ({items.length})
            </Text>
            <Pressable
              onPress={handleAddBlankRow}
              className="w-7 h-7 rounded-full bg-rose-50 border border-rose-300 items-center justify-center active:bg-rose-100">
              <PosIcon name="plus" size={14} color="#E11D48" />
            </Pressable>
          </View>

          {items.length === 0 ? (
            <View className="py-8 items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <PosIcon name="box" size={32} color="#94A3B8" />
              <Text className="text-xs text-slate-500 mt-2 font-medium">
                No items added. Search above or tap (+) to add.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="min-w-[650px] border border-slate-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <View className="flex-row bg-slate-100 py-2.5 px-3 border-b border-slate-200">
                  <Text className="w-8 text-[11px] font-bold text-slate-600">#</Text>
                  <Text className="w-44 text-[11px] font-bold text-slate-600">Product</Text>
                  <Text className="w-20 text-[11px] font-bold text-slate-600">Code</Text>
                  <Text className="w-16 text-[11px] font-bold text-slate-600">Unit</Text>
                  <Text className="w-20 text-[11px] font-bold text-slate-600 text-center">
                    Quantity
                  </Text>
                  <Text className="w-20 text-[11px] font-bold text-slate-600 text-right">
                    Rate
                  </Text>
                  <Text className="w-24 text-[11px] font-bold text-slate-600 text-right">
                    Total
                  </Text>
                  <Text className="w-10 text-[11px] font-bold text-slate-600 text-center"></Text>
                </View>

                {/* Table Body */}
                {items.map((row, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center py-2 px-3 border-b border-slate-100 bg-white">
                    <Text className="w-8 text-xs text-slate-500">{idx + 1}</Text>
                    {/* Product Name Input */}
                    <View className="w-44 pr-2">
                      <TextInput
                        value={row.name}
                        onChangeText={(txt) => updateItem(idx, { name: txt })}
                        placeholder="Product Name"
                        placeholderTextColor="#94A3B8"
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                      />
                    </View>
                    {/* Code/SKU Input */}
                    <View className="w-20 pr-2">
                      <TextInput
                        value={row.sku}
                        onChangeText={(txt) => updateItem(idx, { sku: txt })}
                        placeholder="SKU"
                        placeholderTextColor="#94A3B8"
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                      />
                    </View>
                    {/* Unit */}
                    <View className="w-16 pr-2">
                      <TextInput
                        value={row.unit}
                        onChangeText={(txt) => updateItem(idx, { unit: txt })}
                        placeholder="Unit"
                        placeholderTextColor="#94A3B8"
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                      />
                    </View>
                    {/* Quantity Input */}
                    <View className="w-20 px-1">
                      <TextInput
                        value={String(row.quantity)}
                        keyboardType="numeric"
                        onChangeText={(txt) => {
                          const val = Math.max(parseFloat(txt || '0'), 0);
                          updateItem(idx, { quantity: val });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 text-center"
                      />
                    </View>
                    {/* Rate Input */}
                    <View className="w-20 px-1">
                      <TextInput
                        value={String(row.rate)}
                        keyboardType="numeric"
                        onChangeText={(txt) => {
                          const val = Math.max(parseFloat(txt || '0'), 0);
                          updateItem(idx, { rate: val });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 text-right"
                      />
                    </View>
                    {/* Total Amount */}
                    <Text className="w-24 text-xs font-bold text-slate-800 text-right pr-2">
                      ${row.total.toFixed(2)}
                    </Text>
                    {/* Delete Row Button */}
                    <Pressable
                      onPress={() => removeItem(idx)}
                      className="w-10 items-center justify-center p-1 active:bg-rose-50 rounded">
                      <PosIcon name="trash" size={14} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Financial Summary Box */}
          <View className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex-col gap-3">
            <View className="flex-row justify-between items-center pb-2 border-b border-slate-200">
              <Text className="text-xs font-bold text-slate-600">Total Amount</Text>
              <Text className="text-base font-black text-slate-800">
                ${calculatedTotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs font-bold text-slate-600">Payment</Text>
              <View className="w-36">
                <TextInput
                  value={payment}
                  keyboardType="numeric"
                  onChangeText={setPayment}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 text-right font-bold"
                />
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-slate-200">
              <Text className="text-xs font-bold text-slate-600">Due Amount</Text>
              <Text
                className={`text-sm font-black ${
                  calculatedDue > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                ${calculatedDue.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 flex-row gap-3">
            {onBackToList && (
              <Pressable
                onPress={onBackToList}
                className="flex-1 bg-slate-100 border border-slate-200 py-3 rounded-xl items-center justify-center active:bg-slate-200">
                <Text className="text-xs font-bold text-slate-700">Cancel</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              className={`flex-1 bg-emerald-600 py-3 rounded-xl items-center justify-center active:bg-emerald-700 shadow-sm ${
                submitting ? 'opacity-70' : ''
              }`}>
              {submitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-xs font-bold">Submit Purchase</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

