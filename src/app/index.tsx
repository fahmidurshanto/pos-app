import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, View, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddProductModal, NewProductFormData } from '@/components/add-product-modal';
import { NewSaleModal } from '@/components/new-sale-modal';
import { PosChartsSection } from '@/components/pos-charts-section';
import { PosFooter } from '@/components/pos-footer';
import { PosHeader } from '@/components/pos-header';
import { PosKpiGrid } from '@/components/pos-kpi-grid';
import { PosSidebar } from '@/components/pos-sidebar';
import { PosTablesSection } from '@/components/pos-tables-section';
import { SalesOrderListScreen } from '@/components/sales-order-list-screen';
import { SaleOrderScreen } from '@/components/sale-order-screen';
import { ProductListScreen } from '@/components/product-list-screen';
import { CategoryListScreen } from '@/components/category-list-screen';
import { SubCategoryListScreen } from '@/components/sub-category-list-screen';
import { UnitListScreen } from '@/components/unit-list-screen';
import { SupplierListScreen } from '@/components/supplier-list-screen';
import { KPI_DATA, ProductItem } from '@/constants/pos-data';
import { dashboardService } from '@/services/dashboard-service';
import { productService } from '@/services/product-service';
import { authService } from '@/services/auth-service';
import { DashboardData, ApiProduct } from '@/types/api-types';

export default function DashboardScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSaleModalOpen, setNewSaleModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState('4');

  const fetchAllData = useCallback(async () => {
    try {
      // 1. Silent login check / session
      const loginRes = await authService.login();
      if (loginRes.data?.employee?.company) {
        setCompanyId(loginRes.data.employee.company);
      }

      // 2. Fetch Dashboard stats (API 2) and Products (API 19) in parallel
      const [dashRes, prodRes] = await Promise.all([
        dashboardService.getDashboardData(companyId, '2026'),
        productService.getProducts(companyId),
      ]);

      if (dashRes && dashRes.sale) {
        setDashboardData(dashRes as unknown as DashboardData);
      }

      if (prodRes.data && Array.isArray(prodRes.data)) {
        const mappedProducts: ProductItem[] = prodRes.data.map((item: ApiProduct) => {
          const stockNum = typeof item.stock === 'number' ? item.stock : parseInt(String(item.stock || '0'), 10);
          let status: ProductItem['status'] = 'In Stock';
          if (stockNum === 0) status = 'Out of Stock';
          else if (stockNum < 10) status = 'Low Stock';

          return {
            id: String(item.id),
            name: item.product || 'Unnamed',
            sku: item.sku || `PRD-${item.id}`,
            category: item.category || 'General',
            stock: stockNum,
            price: `$${item.sale_price || '0'}`,
            status,
          };
        });
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleAddProduct = async (formData: NewProductFormData) => {
    try {
      const res = await productService.createProduct({
        product: formData.product,
        sku: formData.sku,
        category_id: formData.category_id,
        unit_id: formData.unit_id,
        buy_price: formData.buy_price,
        sale_price: formData.sale_price,
        company: companyId,
      });

      if (res.error === 'False' || res.code === '200') {
        Alert.alert('Success', `"${formData.product}" added successfully to API!`);
        fetchAllData(); // Refresh live data
      } else {
        Alert.alert('Notice', res.message || 'Product created');
        fetchAllData();
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save product');
    }
  };

  const handleMenuSelect = (item: string) => {
    setActiveMenu(item);
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

      {/* Add Product Modal (Connected to Category & Unit APIs) */}
      <AddProductModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      {/* New Sale Modal (Connected to Live Products API) */}
      <NewSaleModal
        visible={newSaleModalOpen}
        onClose={() => setNewSaleModalOpen(false)}
        products={products}
        onCompleteSale={(total, items, customer) => {
          Alert.alert(
            'Sale Completed (Local Record)',
            `Customer: ${customer || 'Walk-in'}\nItems: ${items.length}\nTotal Paid: $${total.toFixed(2)}\n\n(Waiting for Backend Sale POST API)`
          );
        }}
      />

      {/* Dynamic Content based on activeMenu */}
      {activeMenu === 'Sales_List' ? (
        <ScrollView className="flex-1">
          <SalesOrderListScreen onNewOrder={() => setActiveMenu('Sales_New')} />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Sale_Order' || activeMenu === 'Sales_New' ? (
        <ScrollView className="flex-1">
          <SaleOrderScreen
            products={products}
            onOrderSubmitted={() => setActiveMenu('Sales_List')}
          />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Products_List' ? (
        <ScrollView className="flex-1">
          <ProductListScreen onOpenAddModal={() => setAddModalOpen(true)} />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Products_Category' ? (
        <ScrollView className="flex-1">
          <CategoryListScreen />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Products_SubCategory' ? (
        <ScrollView className="flex-1">
          <SubCategoryListScreen />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Products_Units' ? (
        <ScrollView className="flex-1">
          <UnitListScreen />
          <PosFooter />
        </ScrollView>
      ) : activeMenu === 'Supplier_List' ? (
        <ScrollView className="flex-1">
          <SupplierListScreen />
          <PosFooter />
        </ScrollView>
      ) : (
        /* Scrollable Dashboard Body */
        <ScrollView
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />
          }
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#059669" />
            </View>
          ) : (
            <>
              {/* KPI Cards */}
              <View className="mb-4">
                <PosKpiGrid cards={KPI_DATA} />
              </View>

              {/* Charts & Graphs connected to Live API */}
              <View className="mb-4">
                <PosChartsSection dashboardData={dashboardData} selectedYear="2026" />
              </View>

              {/* Recent Products Table connected to Live API & Low Stock Alerts */}
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
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
