import React from 'react';
import { View, Text } from 'react-native';
import { CATEGORY_PIE_DATA } from '@/constants/pos-data';
import { DashboardData } from '@/types/api-types';

interface PosChartsSectionProps {
  dashboardData?: DashboardData | null;
  selectedYear?: string;
  onSelectYear?: (year: string) => void;
}

export const PosChartsSection: React.FC<PosChartsSectionProps> = ({
  dashboardData,
  selectedYear = '2026',
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const salesData = dashboardData?.sale || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const purchasesData = dashboardData?.purchase || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const stockInData = dashboardData?.stock_in || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const stockOutData = dashboardData?.stock_out || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const maxSale = Math.max(...salesData, ...purchasesData, 1);
  const maxStock = Math.max(...stockInData, ...stockOutData, 1);

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
            <Text className="text-xs font-semibold text-slate-700">{selectedYear} ▾</Text>
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
          {months.map((month, idx) => {
            const saleVal = salesData[idx] || 0;
            const purchVal = purchasesData[idx] || 0;

            const saleH = Math.max((saleVal / maxSale) * 100, 4);
            const purchH = Math.max((purchVal / maxSale) * 100, 4);

            return (
              <View key={month} className="items-center flex-1">
                <View className="flex-row items-end gap-1 h-28">
                  <View
                    style={{ height: `${saleH}%` }}
                    className="w-2 bg-[#5B50E5] rounded-t-sm"
                  />
                  <View
                    style={{ height: `${purchH}%` }}
                    className="w-2 bg-[#93A5FF] rounded-t-sm"
                  />
                </View>
                <Text className="text-[10px] text-slate-400 mt-1 font-medium">
                  {month}
                </Text>
              </View>
            );
          })}
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
            {months.map((month, idx) => {
              const inVal = stockInData[idx] || 0;
              const outVal = stockOutData[idx] || 0;

              const inH = Math.max(Math.round((inVal / maxStock) * 70), 4);
              const outH = Math.max(Math.round((outVal / maxStock) * 50), 4);

              return (
                <View key={month} className="items-center">
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
                  <Text className="text-[9px] text-slate-400 mt-1">{month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};
