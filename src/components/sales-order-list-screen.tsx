import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { PosIcon } from '@/components/pos-icon';
import { saleService } from '@/services/sale-service';
import { useAuth } from '@/context/auth-context';

export interface SaleOrderItem {
  id: string;
  orderNo: string;
  customer: string;
  customerId?: string;
  discount: string;
  due: string;
  totalAmount: string;
  paid: string;
  tax?: string;
  ordDate: string;
  createdOn?: string;
  updatedOn?: string;
  entryBy: string;
  status: string;
  mobile?: string;
  email?: string;
  address?: string;
  note?: string;
  companyId?: string;
}

export interface SaleProductDetail {
  id: string;
  sale_id?: string;
  product_id: string;
  product: string;
  sku: string;
  qty: string | number;
  unit_price: string | number;
  row_total: string | number;
  unit?: string;
  brand?: string;
  category?: string;
  image?: string;
  thumb?: string;
}

interface SalesOrderListScreenProps {
  onNewOrder: () => void;
}

export const SalesOrderListScreen: React.FC<SalesOrderListScreenProps> = ({
  onNewOrder,
}) => {
  const { company } = useAuth();

  const [searchName, setSearchName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [tillDate, setTillDate] = useState('');
  const [orders, setOrders] = useState<SaleOrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SaleOrderItem | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSaleOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await saleService.getSales(undefined, searchName);

      if (res.data && Array.isArray(res.data)) {
        const mapped: SaleOrderItem[] = res.data.map((item: any, idx: number) => ({
          id: String(item.id || idx),
          orderNo: item.order_no || item.inv_no || `ORD-${1000 + idx}`,
          customer: item.customer || item.customer_name || 'Walk-in',
          customerId: item.customer_id,
          discount: item.discount ? `$${item.discount}` : '$0',
          due: item.due ? `$${item.due}` : '$0',
          totalAmount: `$${item.total_amount || item.total || '0'}`,
          paid: item.paid ? `$${item.paid}` : '$0',
          tax: item.tax ? `$${item.tax}` : '$0',
          ordDate: item.date || item.created_on?.split(' ')[0] || '2026-11-12',
          createdOn: item.created_on || '',
          updatedOn: item.updated_on || '',
          entryBy: item.worker || item.entry_by || item.employee_name || 'Admin BDIT',
          status: item.status === '1' || item.status === 'Paid' || item.due === '0' ? 'Paid' : 'Pending',
          mobile: item.mobile || '',
          email: item.email || '',
          address: item.address || '',
          note: item.note || '',
          companyId: item.company || '',
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

  const handleViewOrder = async (order: SaleOrderItem) => {
    setSelectedOrder(order);
    setModalVisible(true);
    setLoadingDetails(true);

    try {
      const res = await saleService.getSaleDetails(order.id);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrderDetails(res.data[0]);
      } else {
        setOrderDetails(null);
      }
    } catch (err) {
      console.error('Failed to load sale details:', err);
      setOrderDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    Alert.alert(
      'Delete Sale Order',
      `Are you sure you want to delete order #${orderNumber}? This will remove it from the system.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(orderId);
            try {
              const res = await saleService.deleteSale(orderId);
              if (res.error === 'False' || res.code === '200' || res.message === 'Delete Success') {
                Alert.alert('Deleted', 'Order deleted successfully.');
                if (modalVisible && selectedOrder?.id === orderId) {
                  setModalVisible(false);
                }
                fetchSaleOrders();
              } else {
                Alert.alert('Error', res.message || 'Failed to delete order');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Delete operation failed');
            } finally {
              setDeletingId(null);
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
            <View className="flex-1 min-w-[120px]">
              <TextInput
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="From Date"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Till Date */}
            <View className="flex-1 min-w-[120px]">
              <TextInput
                value={tillDate}
                onChangeText={setTillDate}
                placeholder="Till Date"
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </View>

            {/* Search Button */}
            <Pressable
              onPress={fetchSaleOrders}
              className="bg-emerald-600 px-5 py-2.5 rounded-lg active:bg-emerald-700 shadow-sm flex-row items-center gap-1.5">
              <PosIcon name="search" size={13} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Search</Text>
            </Pressable>
          </View>
        </View>

        {/* Scrollable Table View */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-[860px]">
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
              <Text className="w-28 text-[11px] font-bold text-slate-700 text-center">Actions</Text>
            </View>

            {/* Table Body */}
            {loading ? (
              <View className="p-8 items-center justify-center">
                <ActivityIndicator size="small" color="#059669" />
                <Text className="text-xs text-slate-400 mt-2">Loading sales orders from API...</Text>
              </View>
            ) : orders.length === 0 ? (
              <View className="p-8 items-center justify-center">
                <PosIcon name="box" size={32} color="#CBD5E1" />
                <Text className="text-xs text-slate-500 font-semibold mt-2">No data available</Text>
              </View>
            ) : (
              orders.map((ord, idx) => (
                <View
                  key={ord.id}
                  className="flex-row items-center py-2.5 px-3 border-b border-slate-100 bg-white">
                  <Text className="w-8 text-xs text-slate-500">{idx + 1}</Text>
                  <Text className="w-24 text-xs font-semibold text-slate-800">{ord.orderNo}</Text>
                  <Text className="w-32 text-xs text-slate-700" numberOfLines={1}>{ord.customer}</Text>
                  <Text className="w-20 text-xs text-slate-500">{ord.discount}</Text>
                  <Text className="w-16 text-xs text-rose-600 font-semibold">{ord.due}</Text>
                  <Text className="w-24 text-xs font-bold text-slate-900">{ord.totalAmount}</Text>
                  <Text className="w-16 text-xs text-emerald-600 font-semibold">{ord.paid}</Text>
                  <Text className="w-24 text-xs text-slate-500">{ord.ordDate}</Text>
                  <Text className="w-24 text-xs text-slate-600" numberOfLines={1}>{ord.entryBy}</Text>
                  <View className="w-20">
                    <View
                      className={`px-2 py-0.5 rounded-full self-start ${
                        ord.status === 'Paid'
                          ? 'bg-emerald-50 border border-emerald-200'
                          : 'bg-amber-50 border border-amber-200'
                      }`}>
                      <Text
                        className={`text-[10px] font-bold ${
                          ord.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                        {ord.status}
                      </Text>
                    </View>
                  </View>
                  <View className="w-28 flex-row items-center justify-center gap-1.5">
                    <Pressable
                      onPress={() => handleViewOrder(ord)}
                      className="px-2 py-1 rounded bg-blue-50 border border-blue-200 active:bg-blue-100 flex-row items-center gap-1">
                      <PosIcon name="maximize" size={10} color="#2563EB" />
                      <Text className="text-[11px] text-blue-600 font-bold">View</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteOrder(ord.id, ord.orderNo)}
                      disabled={deletingId === ord.id}
                      className="p-1.5 rounded bg-rose-50 border border-rose-200 active:bg-rose-100">
                      {deletingId === ord.id ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <PosIcon name="trash" size={11} color="#EF4444" />
                      )}
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* Sale Order Details / Invoice Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/60 justify-end md:justify-center p-0 md:p-4">
          <View className="bg-white rounded-t-3xl md:rounded-2xl max-h-[92%] overflow-hidden flex-col shadow-2xl">
            {/* Modal Header with Company Logo & Name */}
            <View className="p-4 bg-slate-900 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                {company?.logo ? (
                  <Image
                    source={{ uri: company.logo }}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 items-center justify-center">
                    <PosIcon name="shopping-cart" size={18} color="#10B981" />
                  </View>
                )}
                <View>
                  <Text className="text-white text-base font-extrabold">
                    {company?.organiz || 'POS System'} - Invoice #{selectedOrder?.orderNo}
                  </Text>
                  <Text className="text-[11px] text-slate-400">
                    Order Date: {selectedOrder?.ordDate} | Created: {selectedOrder?.createdOn || selectedOrder?.ordDate}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-2 rounded-full bg-slate-800 active:bg-slate-700">
                <PosIcon
                  name="plus"
                  size={16}
                  color="#94A3B8"
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </Pressable>
            </View>

            <ScrollView className="p-4 flex-col gap-4">
              {/* Customer & Order Summary Card */}
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex-col gap-2">
                <View className="flex-row justify-between items-center pb-2 border-b border-slate-200">
                  <View className="flex-row items-center gap-1.5">
                    <PosIcon name="users" size={13} color="#475569" />
                    <Text className="text-xs font-bold text-slate-800">Customer Details</Text>
                  </View>
                  <View
                    className={`px-2 py-0.5 rounded-full ${
                      selectedOrder?.status === 'Paid'
                        ? 'bg-emerald-50 border border-emerald-300'
                        : 'bg-amber-50 border border-amber-300'
                    }`}>
                    <Text
                      className={`text-[10px] font-bold ${
                        selectedOrder?.status === 'Paid'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}>
                      Status: {selectedOrder?.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-500">Name:</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {orderDetails?.customer || selectedOrder?.customer}
                  </Text>
                </View>

                {(orderDetails?.customer_id || selectedOrder?.customerId) ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Customer ID:</Text>
                    <Text className="text-xs font-medium text-slate-700">
                      #{orderDetails?.customer_id || selectedOrder?.customerId}
                    </Text>
                  </View>
                ) : null}

                {(orderDetails?.mobile || selectedOrder?.mobile) ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Phone:</Text>
                    <Text className="text-xs font-semibold text-slate-700">
                      {orderDetails?.mobile || selectedOrder?.mobile}
                    </Text>
                  </View>
                ) : null}

                {(orderDetails?.email || selectedOrder?.email) ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Email:</Text>
                    <Text className="text-xs text-slate-700">
                      {orderDetails?.email || selectedOrder?.email}
                    </Text>
                  </View>
                ) : null}

                {(orderDetails?.address || selectedOrder?.address) ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Address:</Text>
                    <Text className="text-xs font-medium text-slate-700">
                      {orderDetails?.address || selectedOrder?.address}
                    </Text>
                  </View>
                ) : null}

                <View className="flex-row justify-between pt-1 border-t border-slate-200/60">
                  <Text className="text-xs text-slate-500">Served By:</Text>
                  <Text className="text-xs font-semibold text-slate-800">
                    {orderDetails?.worker || selectedOrder?.entryBy}
                  </Text>
                </View>

                {(orderDetails?.note || selectedOrder?.note) ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-500">Note / Remarks:</Text>
                    <Text className="text-xs italic text-slate-600">
                      {orderDetails?.note || selectedOrder?.note}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Products Item Table with Thumbnail, SKU, Category, Brand */}
              <View className="flex-col gap-2">
                <Text className="text-xs font-bold text-slate-800">Purchased Items</Text>

                {loadingDetails ? (
                  <View className="py-8 items-center justify-center">
                    <ActivityIndicator size="small" color="#059669" />
                    <Text className="text-xs text-slate-400 mt-2">Loading invoice items...</Text>
                  </View>
                ) : orderDetails?.products && orderDetails.products.length > 0 ? (
                  <View className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {/* Header */}
                    <View className="flex-row bg-slate-100 py-2.5 px-3 border-b border-slate-200">
                      <Text className="w-7 text-[11px] font-bold text-slate-600">#</Text>
                      <Text className="flex-1 text-[11px] font-bold text-slate-600">Item & Details</Text>
                      <Text className="w-14 text-[11px] font-bold text-slate-600 text-center">Qty</Text>
                      <Text className="w-20 text-[11px] font-bold text-slate-600 text-right">Price</Text>
                      <Text className="w-20 text-[11px] font-bold text-slate-600 text-right">Total</Text>
                    </View>

                    {/* Rows */}
                    {orderDetails.products.map((prod: SaleProductDetail, pIdx: number) => {
                      const imageUri = prod.image || prod.thumb;
                      return (
                        <View
                          key={prod.id || pIdx}
                          className="flex-row items-center py-2.5 px-3 border-b border-slate-100">
                          <Text className="w-7 text-xs text-slate-400">{pIdx + 1}</Text>
                          
                          {/* Item with Image Thumbnail & Metadata */}
                          <View className="flex-1 flex-row items-center gap-2 pr-2">
                            {imageUri ? (
                              <Image
                                source={{ uri: imageUri }}
                                className="w-8 h-8 rounded bg-slate-100 border border-slate-200"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="w-8 h-8 rounded bg-slate-100 border border-slate-200 items-center justify-center">
                                <PosIcon name="box" size={14} color="#94A3B8" />
                              </View>
                            )}
                            <View className="flex-1">
                              <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>
                                {prod.product}
                              </Text>
                              <Text className="text-[10px] text-slate-500" numberOfLines={1}>
                                SKU: {prod.sku || '-'} {prod.brand ? `• Brand: ${prod.brand}` : ''} {prod.category ? `• Cat: ${prod.category}` : ''} {prod.unit ? `(${prod.unit})` : ''}
                              </Text>
                            </View>
                          </View>

                          <Text className="w-14 text-xs text-slate-700 text-center font-medium">
                            {prod.qty}
                          </Text>
                          <Text className="w-20 text-xs text-slate-600 text-right">
                            ${prod.unit_price}
                          </Text>
                          <Text className="w-20 text-xs font-bold text-slate-900 text-right">
                            ${prod.row_total}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View className="py-6 items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Text className="text-xs text-slate-500">
                      Product details available in primary order record.
                    </Text>
                  </View>
                )}
              </View>

              {/* Financial Breakdown Card (Subtotal, Discount, Tax, Paid, Due) */}
              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex-col gap-2 mb-6">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-600">Subtotal Amount</Text>
                  <Text className="text-xs font-bold text-slate-800">
                    {selectedOrder?.totalAmount}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-600">Discount</Text>
                  <Text className="text-xs font-semibold text-slate-700">
                    {selectedOrder?.discount}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-600">Tax</Text>
                  <Text className="text-xs font-medium text-slate-700">
                    {selectedOrder?.tax || '$0'}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-slate-600">Paid Amount</Text>
                  <Text className="text-xs font-bold text-emerald-600">
                    {selectedOrder?.paid}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center pt-2 border-t border-slate-200">
                  <Text className="text-xs font-bold text-slate-800">Due Amount</Text>
                  <Text
                    className={`text-sm font-black ${
                      selectedOrder?.due && selectedOrder.due !== '$0'
                        ? 'text-rose-600'
                        : 'text-emerald-600'
                    }`}>
                    {selectedOrder?.due}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Bottom Actions: Delete Order & Close */}
            <View className="p-4 bg-white border-t border-slate-200 flex-row gap-3">
              {selectedOrder && (
                <Pressable
                  onPress={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderNo)}
                  className="bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl flex-row items-center gap-1.5 active:bg-rose-100">
                  <PosIcon name="trash" size={14} color="#EF4444" />
                  <Text className="text-xs font-bold text-rose-600">Delete</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-slate-100 py-3 rounded-xl items-center justify-center active:bg-slate-200">
                <Text className="text-xs font-bold text-slate-700">Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
