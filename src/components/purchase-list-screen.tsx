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
import { purchaseService } from '@/services/purchase-service';
import { ApiPurchaseItem } from '@/types/api-types';

interface PurchaseListScreenProps {
  onNewOrder: () => void;
}

export const PurchaseListScreen: React.FC<PurchaseListScreenProps> = ({ onNewOrder }) => {
  const [orders, setOrders] = useState<ApiPurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters from Website UI
  const [orderNo, setOrderNo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [supplierQuery, setSupplierQuery] = useState('');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      // API 23: GET /api/v1/purchases
      const res = await purchaseService.getPurchases({
        name: supplierQuery.trim() || undefined,
        auto: orderNo.trim() || undefined,
        date_from: dateFrom.trim() || undefined,
        date_to: dateTo.trim() || undefined,
      });

      if (res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchases from API:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [orderNo, dateFrom, dateTo, supplierQuery]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  // API 26: PATCH /api/v1/purchases (Delete)
  const handleDelete = (rowId: string, orderNumber: string) => {
    Alert.alert(
      'Delete Purchase Order',
      `Are you sure you want to delete purchase order #${orderNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await purchaseService.deletePurchase(rowId);
              if (res.error === 'False' || res.code === '200' || res.message === 'Delete Success') {
                Alert.alert('Deleted', 'Purchase order deleted successfully.');
                fetchPurchases();
              } else {
                Alert.alert('Error', res.message || 'Failed to delete');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Delete operation failed');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Container Card */}
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
          <Text className="text-slate-800 text-lg font-bold">Purchase Order list</Text>
          <Pressable
            onPress={onNewOrder}
            className="bg-emerald-600 px-4 py-2 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">New Order</Text>
          </Pressable>
        </View>

        {/* Filters Section (Matches Website UI) */}
        <View className="p-4 bg-slate-50 border-b border-slate-100 flex-col gap-3">
          <View className="flex-row flex-wrap gap-2.5 items-center">
            {/* Order No Filter */}
            <View className="flex-1 min-w-[120px]">
              <TextInput
                value={orderNo}
                onChangeText={setOrderNo}
                placeholder="Order. No"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Date From Filter */}
            <View className="flex-1 min-w-[110px]">
              <TextInput
                value={dateFrom}
                onChangeText={setDateFrom}
                placeholder="Date from (YYYY-MM-DD)"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Date To Filter */}
            <View className="flex-1 min-w-[110px]">
              <TextInput
                value={dateTo}
                onChangeText={setDateTo}
                placeholder="Date To (YYYY-MM-DD)"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Suppliers Filter */}
            <View className="flex-1 min-w-[130px]">
              <TextInput
                value={supplierQuery}
                onChangeText={setSupplierQuery}
                placeholder="Suppliers"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Search Button */}
            <Pressable
              onPress={fetchPurchases}
              className="bg-emerald-600 px-5 py-2.5 rounded-lg active:bg-emerald-700 shadow-sm flex-row items-center gap-1.5">
              <PosIcon name="search" size={13} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Search</Text>
            </Pressable>
          </View>
        </View>

        {/* Content Table / Card List */}
        {loading ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="text-xs text-slate-500 mt-2 font-medium">Loading purchases...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <PosIcon name="box" size={40} color="#CBD5E1" />
            <Text className="text-sm font-semibold text-slate-600 mt-2">No data available</Text>
            <Text className="text-xs text-slate-400 mt-0.5">
              No purchase orders found matching your criteria.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="min-w-[850px]">
              {/* Table Header */}
              <View className="flex-row bg-slate-50 py-3 px-4 border-b border-slate-200">
                <Text className="w-10 text-[11px] font-bold text-slate-600">#</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-600">Order NO.</Text>
                <Text className="w-40 text-[11px] font-bold text-slate-600">Supplier</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-600">Amount</Text>
                <Text className="w-24 text-[11px] font-bold text-slate-600">Ord.Date</Text>
                <Text className="w-36 text-[11px] font-bold text-slate-600">DateTime</Text>
                <Text className="w-28 text-[11px] font-bold text-slate-600">Entry By</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-600">Status</Text>
                <Text className="w-20 text-[11px] font-bold text-slate-600 text-center">
                  Actions
                </Text>
              </View>

              {/* Table Rows */}
              <ScrollView>
                {orders.map((ord, idx) => (
                  <View
                    key={ord.id || idx}
                    className="flex-row items-center py-3 px-4 border-b border-slate-100 bg-white">
                    <Text className="w-10 text-xs text-slate-400 font-medium">{idx + 1}</Text>
                    <Text className="w-24 text-xs font-bold text-slate-800">
                      {ord.order_no || `#${ord.id}`}
                    </Text>
                    <Text className="w-40 text-xs text-slate-700 font-medium" numberOfLines={1}>
                      {ord.supplier || 'Unknown'}
                    </Text>
                    <Text className="w-24 text-xs font-bold text-emerald-600">
                      ${ord.total_amount || '0'}
                    </Text>
                    <Text className="w-24 text-xs text-slate-600">{ord.date || '-'}</Text>
                    <Text className="w-36 text-[11px] text-slate-500">
                      {ord.created_on || ord.updated_on || '-'}
                    </Text>
                    <Text className="w-28 text-xs text-slate-600" numberOfLines={1}>
                      {ord.worker || 'Admin BDIT'}
                    </Text>
                    <View className="w-20">
                      <View
                        className={`px-2 py-0.5 rounded-full self-start ${
                          ord.status === '1' || ord.due === '0'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-amber-50 border border-amber-200'
                        }`}>
                        <Text
                          className={`text-[10px] font-bold ${
                            ord.status === '1' || ord.due === '0'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}>
                          {ord.due === '0' ? 'Paid' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    <View className="w-20 flex-row items-center justify-center gap-1.5">
                      <Pressable
                        onPress={() => handleDelete(String(ord.id), ord.order_no || String(ord.id))}
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
    </View>
  );
};

