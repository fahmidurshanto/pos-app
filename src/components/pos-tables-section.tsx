import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { RECENT_PRODUCTS, LOW_STOCK_ALERTS } from '@/constants/pos-data';
import { PosIcon } from '@/components/pos-icon';

interface PosTablesSectionProps {
  products?: typeof RECENT_PRODUCTS;
  onOpenAddModal?: () => void;
  onViewAllAlerts?: () => void;
}

export const PosTablesSection: React.FC<PosTablesSectionProps> = ({
  products = RECENT_PRODUCTS,
  onOpenAddModal,
  onViewAllAlerts,
}) => {
  return (
    <View className="flex-col gap-4">
      {/* 1. Recent Products Table */}
      <View className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-slate-800 text-base font-bold">Recent Products</Text>
            <Text className="text-slate-400 text-xs">Latest inventory updates</Text>
          </View>
          <Pressable
            onPress={onOpenAddModal}
            className="bg-[#4F46E5] px-3 py-1.5 rounded-lg flex-row items-center gap-1.5 active:bg-[#4338CA]">
            <PosIcon name="plus" size={12} color="#FFFFFF" />
            <Text className="text-white text-xs font-semibold">Add Product</Text>
          </Pressable>
        </View>

        {/* Horizontal scrollable table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-[480px]">
            {/* Table Header */}
            <View className="flex-row border-b border-slate-100 pb-2 mb-2">
              <Text className="w-32 text-[11px] font-bold text-slate-400 uppercase">
                Product
              </Text>
              <Text className="w-20 text-[11px] font-bold text-slate-400 uppercase">
                SKU
              </Text>
              <Text className="w-24 text-[11px] font-bold text-slate-400 uppercase">
                Category
              </Text>
              <Text className="w-16 text-[11px] font-bold text-slate-400 uppercase">
                Stock
              </Text>
              <Text className="w-16 text-[11px] font-bold text-slate-400 uppercase">
                Price
              </Text>
              <Text className="w-24 text-[11px] font-bold text-slate-400 uppercase">
                Status
              </Text>
            </View>

            {/* Table Body */}
            {products.map((prod) => {
              const isInStock = prod.status === 'In Stock';
              const isLowStock = prod.status === 'Low Stock';

              const badgeBg = isInStock
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : isLowStock
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-rose-50 text-rose-600 border-rose-200';

              const badgeTextColor = isInStock
                ? 'text-emerald-700'
                : isLowStock
                ? 'text-amber-700'
                : 'text-rose-700';

              return (
                <View
                  key={prod.id}
                  className="flex-row items-center py-2.5 border-b border-slate-50">
                  <Text className="w-32 text-xs font-semibold text-slate-800">
                    {prod.name}
                  </Text>
                  <Text className="w-20 text-xs text-slate-500 font-mono">
                    {prod.sku}
                  </Text>
                  <Text className="w-24 text-xs text-slate-600">
                    {prod.category}
                  </Text>
                  <Text className="w-16 text-xs text-slate-700 font-medium">
                    {prod.stock}
                  </Text>
                  <Text className="w-16 text-xs font-semibold text-slate-900">
                    {prod.price}
                  </Text>
                  <View className="w-24">
                    <View
                      className={`px-2 py-0.5 rounded-full border self-start ${badgeBg}`}>
                      <Text className={`text-[10px] font-semibold ${badgeTextColor}`}>
                        {prod.status}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* 2. Low Stock Alerts */}
      <View className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <Text className="text-slate-800 text-base font-bold">Low Stock Alerts</Text>
        <Text className="text-slate-400 text-xs mb-3">Products requiring restocking</Text>

        <View className="divide-y divide-slate-100">
          {LOW_STOCK_ALERTS.map((alert) => {
            const isZero = alert.leftCount === 0;
            const badgeBg = isZero ? 'bg-rose-100' : 'bg-amber-100';
            const badgeText = isZero ? 'text-rose-700' : 'text-amber-700';

            return (
              <View
                key={alert.id}
                className="flex-row items-center justify-between py-2.5">
                <View>
                  <Text className="text-xs font-semibold text-slate-800">
                    {alert.title}
                  </Text>
                  <Text className="text-[11px] text-slate-400 font-mono">
                    {alert.sku}
                  </Text>
                </View>

                <View className={`px-2.5 py-1 rounded-md ${badgeBg}`}>
                  <Text className={`text-[10px] font-bold ${badgeText}`}>
                    {alert.leftCount} Left
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={onViewAllAlerts}
          className="mt-4 bg-[#4F46E5] py-2.5 rounded-lg items-center active:bg-[#4338CA]">
          <Text className="text-white text-xs font-bold">View All Alerts</Text>
        </Pressable>
      </View>
    </View>
  );
};

