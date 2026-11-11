import React from 'react';
import { View, Text } from 'react-native';
import { MONTHLY_SALES_DATA, CATEGORY_PIE_DATA } from '@/constants/pos-data';

export const PosChartsSection: React.FC = () => {
  return (
    <View className="flex-col gap-4">
      {/* 1. Monthly Sales Overview */}
      <View className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-slate-800 text-base font-bold">
              Monthly Sales Overview
            </Text>
            <Text className="text-slate-400 text-xs">
              Sales and purchases performance
            </Text>
          </View>
          <View className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50">
            <Text className="text-xs font-semibold text-slate-700">2026 ▾</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-end gap-4 mb-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-sm bg-[#5B50E5]" />
            <Text className="text-xs text-slate-500">Sales</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-3 rounded-sm bg-[#93A5FF]" />
            <Text className="text-xs text-slate-500">Purchases</Text>
          </View>
        </View>

        {/* Bar chart representation */}
        <View className="h-40 flex-row items-end justify-between border-b border-l border-slate-200 pt-4 pb-1 pl-1">
          {MONTHLY_SALES_DATA.map((item) => (
            <View key={item.month} className="items-center flex-1">
              <View className="flex-row items-end gap-1 h-28">
                <View
                  style={{ height: `${item.sales * 100}%` }}
                  className="w-2 bg-[#5B50E5] rounded-t-sm"
                />
                <View
                  style={{ height: `${item.purchases * 100}%` }}
                  className="w-2 bg-[#93A5FF] rounded-t-sm"
                />
              </View>
              <Text className="text-[10px] text-slate-400 mt-1 font-medium">
                {item.month}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Product Categories Donut Chart Representation */}
      <View className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <Text className="text-slate-800 text-base font-bold">
          Product Categories
        </Text>
        <Text className="text-slate-400 text-xs mb-4">
          Inventory distribution by category
        </Text>

        {/* Donut representation */}
        <View className="items-center justify-center py-4">
          <View className="w-40 h-40 rounded-full border-[18px] border-[#5B50E5] items-center justify-center relative">
            <View className="absolute inset-0 rounded-full border-[18px] border-emerald-400 border-t-transparent border-l-transparent" />
            <View className="items-center justify-center">
              <Text className="text-lg font-bold text-slate-800">100%</Text>
              <Text className="text-[10px] text-slate-400">Total</Text>
            </View>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-2 pt-2 border-t border-slate-100">
          {CATEGORY_PIE_DATA.map((cat) => (
            <View key={cat.name} className="flex-row items-center gap-1.5">
              <View
                style={{ backgroundColor: cat.color }}
                className="w-2.5 h-2.5 rounded-full"
              />
              <Text className="text-xs text-slate-600 font-medium">
                {cat.name} ({cat.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Inventory Stock Trends */}
      <View className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-slate-800 text-base font-bold">
              Inventory Stock Trends
            </Text>
            <Text className="text-slate-400 text-xs">
              Monthly stock-in and stock-out analysis
            </Text>
          </View>
          <View className="px-3 py-1 rounded-md border border-slate-200 bg-slate-50">
            <Text className="text-xs font-semibold text-slate-700">Export</Text>
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row items-center justify-end gap-4 mb-2">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-0.5 bg-[#6366F1]" />
            <Text className="text-xs text-slate-500">Stock In</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-3 h-0.5 bg-[#10B981]" />
            <Text className="text-xs text-slate-500">Stock Out</Text>
          </View>
        </View>

        {/* Trend representation */}
        <View className="h-32 justify-between border-b border-l border-slate-200 pt-3 pb-1 pl-1">
          <View className="flex-row justify-between items-center h-24 px-2">
            {MONTHLY_SALES_DATA.map((item, idx) => {
              const inH = Math.round(item.sales * 70);
              const outH = Math.round(item.purchases * 50);
              return (
                <View key={item.month} className="items-center">
                  <View className="h-20 justify-end items-center relative">
                    <View
                      style={{ height: inH }}
                      className="w-1.5 bg-[#6366F1] rounded-full mb-1 opacity-80"
                    />
                    <View
                      style={{ height: outH }}
                      className="w-1.5 bg-[#10B981] rounded-full opacity-80"
                    />
                  </View>
                  <Text className="text-[9px] text-slate-400 mt-1">{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

