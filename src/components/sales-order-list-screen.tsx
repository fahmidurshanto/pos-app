import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { saleService } from '@/services/sale-service';
import { API_CONFIG } from '@/constants/api';

export interface SaleOrderItem {
  id: string;
  orderNo: string;
  customer: string;
  discount: string;
  due: string;
  totalAmount: string;
  paid: string;
  ordDate: string;
  entryBy: string;
  status: string;
}

interface SalesOrderListScreenProps {
  onNewOrder: () => void;
}

export const SalesOrderListScreen: React.FC<SalesOrderListScreenProps> = ({
  onNewOrder,
}) => {
  const [searchName, setSearchName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [tillDate, setTillDate] = useState('');
  const [orders, setOrders] = useState<SaleOrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaleOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Call Live API /api/v1/sales
      const res = await saleService.getSales(API_CONFIG.DEFAULT_COMPANY, searchName);

      if (res.data && Array.isArray(res.data)) {
        const mapped: SaleOrderItem[] = res.data.map((item: any, idx: number) => ({
          id: String(item.id || idx),
          orderNo: item.order_no || item.inv_no || `ORD-${1000 + idx}`,
          customer: item.customer || item.customer_name || 'Walk-in',
          discount: item.discount ? `$${item.discount}` : '$0',
          due: item.due ? `$${item.due}` : '$0',
          totalAmount: `$${item.total_amount || item.total || '0'}`,
          paid: item.paid ? `$${item.paid}` : '$0',
          ordDate: item.date || item.created_on?.split(' ')[0] || '2026-11-12',
          entryBy: item.worker || item.entry_by || item.employee_name || 'Admin BDIT',
          status: item.status === '1' || item.status === 'Paid' ? 'Paid' : 'Pending',
        }));
        setOrders(mapped);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching sales orders from API:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [searchName]);

  useEffect(() => {
    fetchSaleOrders();
  }, [fetchSaleOrders]);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Container Card */}
      <View className="m-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Header Card */}
        <View className="flex-row items-center justify-between p-4 border-b border-slate-200">
          <Text className="text-slate-800 text-lg font-bold">Sale Order list</Text>
          <Pressable
            onPress={onNewOrder}
            className="bg-emerald-600 px-4 py-2 rounded-lg flex-row items-center gap-1.5 active:bg-emerald-700 shadow-sm">
            <PosIcon name="plus" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">New Order</Text>
          </Pressable>
        </View>

        {/* Filters Section */}
        <View className="p-4 bg-slate-50 border-b border-slate-100 flex-col gap-3">
          <View className="flex-row flex-wrap gap-2.5 items-center">
            {/* Name / Inv No Input */}
            <View className="flex-1 min-w-[140px]">
              <TextInput
                value={searchName}
                onChangeText={setSearchName}
                placeholder="Name/Inv. No"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* From Date */}
            <View className="flex-1 min-w-[120px] flex-row items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5">
              <TextInput
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="From date"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-slate-800 p-0"
              />
              <Text className="text-slate-400 text-xs">📅</Text>
            </View>

            {/* Till Date */}
            <View className="flex-1 min-w-[120px] flex-row items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5">
              <TextInput
                value={tillDate}
                onChangeText={setTillDate}
                placeholder="Till date"
                placeholderTextColor="#94A3B8"
                className="flex-1 text-xs text-slate-800 p-0"
              />
              <Text className="text-slate-400 text-xs">📅</Text>
            </View>

            {/* Green Search Button */}
            <Pressable
              onPress={fetchSaleOrders}
              className="bg-emerald-600 px-4 py-2.5 rounded-lg active:bg-emerald-700 items-center justify-center">
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-xs font-bold">Search</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Scrollable Table View */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-[760px]">
            {/* Table Header */}
            <View className="flex-row bg-slate-100/70 border-b border-slate-200 py-3 px-3">
              <Text className="w-8 text-[11px] font-bold text-slate-700">#</Text>
              <Text className="w-24 text-[11px] font-bold text-slate-700">Order NO.</Text>
              <Text className="w-32 text-[11px] font-bold text-slate-700">Customer</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Discount</Text>
              <Text className="w-16 text-[11px] font-bold text-slate-700">Due</Text>
              <Text className="w-24 text-[11px] font-bold text-slate-700">Total Amount</Text>
              <Text className="w-16 text-[11px] font-bold text-slate-700">Paid</Text>
              <Text className="w-24 text-[11px] font-bold text-slate-700">Ord.Date</Text>
              <Text className="w-24 text-[11px] font-bold text-slate-700">Entry By</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Status</Text>
              <Text className="w-20 text-[11px] font-bold text-slate-700">Actions</Text>
            </View>

            {/* Table Body */}
            {loading ? (
              <View className="p-8 items-center justify-center">
                <ActivityIndicator size="small" color="#059669" />
                <Text className="text-xs text-slate-400 mt-2">Loading sales orders from API...</Text>
              </View>
            ) : orders.length === 0 ? (
              <View className="p-4 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">No data available</Text>
              </View>
            ) : (
              orders.map((ord, idx) => (
                <View
                  key={ord.id}
                  className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                  <Text className="w-8 text-xs text-slate-500">{idx + 1}</Text>
                  <Text className="w-24 text-xs font-semibold text-slate-800">{ord.orderNo}</Text>
                  <Text className="w-32 text-xs text-slate-700">{ord.customer}</Text>
                  <Text className="w-20 text-xs text-slate-500">{ord.discount}</Text>
                  <Text className="w-16 text-xs text-rose-600 font-semibold">{ord.due}</Text>
                  <Text className="w-24 text-xs font-bold text-slate-900">{ord.totalAmount}</Text>
                  <Text className="w-16 text-xs text-emerald-600 font-semibold">{ord.paid}</Text>
                  <Text className="w-24 text-xs text-slate-500">{ord.ordDate}</Text>
                  <Text className="w-24 text-xs text-slate-600">{ord.entryBy}</Text>
                  <Text className="w-20 text-xs text-slate-700">{ord.status}</Text>
                  <View className="w-20 flex-row gap-2">
                    <Text className="text-xs text-blue-600 font-semibold">View</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
