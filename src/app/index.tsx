import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddProductModal } from '@/components/add-product-modal';
import { NewSaleModal } from '@/components/new-sale-modal';
import { PosChartsSection } from '@/components/pos-charts-section';
import { PosFooter } from '@/components/pos-footer';
import { PosHeader } from '@/components/pos-header';
import { PosKpiGrid } from '@/components/pos-kpi-grid';
import { PosSidebar } from '@/components/pos-sidebar';
import { PosTablesSection } from '@/components/pos-tables-section';
import { KPI_DATA, RECENT_PRODUCTS, ProductItem } from '@/constants/pos-data';

export default function DashboardScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [products, setProducts] = useState<ProductItem[]>(RECENT_PRODUCTS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSaleModalOpen, setNewSaleModalOpen] = useState(false);

  const handleAddProduct = (newProduct: Omit<ProductItem, 'id'>) => {
    const product: ProductItem = {
      ...newProduct,
      id: Date.now().toString(),
    };
    setProducts((prev) => [product, ...prev]);
    Alert.alert('Success', `"${product.name}" added to inventory.`);
  };

  const handleMenuSelect = (item: string) => {
    setActiveMenu(item);
    if (item === 'Sales_New') {
      setNewSaleModalOpen(true);
    } else if (item === 'Products_List') {
      setAddModalOpen(true);
    } else {
      Alert.alert('Section Opened', `Navigated to ${item}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <PosHeader onOpenSidebar={() => setSidebarOpen(true)} />

      {/* Drawer / Sidebar Modal with all submenus */}
      <PosSidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeMenu}
        onSelectItem={handleMenuSelect}
      />

      {/* Add Product Modal */}
      <AddProductModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      {/* New Sale Modal */}
      <NewSaleModal
        visible={newSaleModalOpen}
        onClose={() => setNewSaleModalOpen(false)}
        onCompleteSale={(total) => {
          Alert.alert('Sale Completed', `Payment received: $${total.toFixed(2)}`);
        }}
      />

      {/* Scrollable Dashboard Body */}
      <ScrollView
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* KPI Cards */}
        <View className="mb-4">
          <PosKpiGrid cards={KPI_DATA} />
        </View>

        {/* Charts & Graphs */}
        <View className="mb-4">
          <PosChartsSection />
        </View>

        {/* Recent Products Table & Low Stock Alerts */}
        <View className="mb-4">
          <PosTablesSection
            products={products}
            onOpenAddModal={() => setAddModalOpen(true)}
            onViewAllAlerts={() => {
              setActiveMenu('Damage_ExpirationList');
              Alert.alert('Alerts', 'Showing low stock and restocking alerts.');
            }}
          />
        </View>

        {/* Footer */}
        <PosFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
