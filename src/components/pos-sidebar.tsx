import React from 'react';
import { View, Text, Pressable, ScrollView, Modal, SafeAreaView } from 'react-native';
import { PosIcon, IconName } from '@/components/pos-icon';

interface PosSidebarProps {
  visible: boolean;
  onClose: () => void;
  activeItem: string;
  onSelectItem: (item: string) => void;
}

interface SubMenuItem {
  id: string;
  title: string;
  icon?: IconName;
}

interface MenuItem {
  id: string;
  title: string;
  icon: IconName;
  children?: SubMenuItem[];
}

// ONLY TABS THAT HAVE CORRESPONDING APIS FROM BACKEND DEVELOPER (22 APIs)
export const MENU_ITEMS: MenuItem[] = [
  // 1. Dashboard (API 1: login, API 2: dashboard)
  { id: 'Dashboard', title: 'Dashboard', icon: 'dashboard' },

  // 2. Sales (API: saleService createSale & getSales)
  {
    id: 'Sales',
    title: 'Sales',
    icon: 'shopping-cart',
    children: [
      { id: 'Sales_List', title: 'Sales' },
      { id: 'Sales_New', title: 'New Sale' },
    ],
  },

  // 3. Products & Inventory (API 7-10: category, API 11-14: subcats, API 15-18: units, API 19-22: products)
  {
    id: 'Products',
    title: 'Products',
    icon: 'box',
    children: [
      { id: 'Products_List', title: 'Products List' },
      { id: 'Products_Category', title: 'Category' },
      { id: 'Products_SubCategory', title: 'Sub Category' },
      { id: 'Products_Units', title: 'Units' },
    ],
  },

  // 4. Supplier (API 3-6: suppliers CRUD)
  {
    id: 'Supplier',
    title: 'Supplier',
    icon: 'users',
    children: [
      { id: 'Supplier_List', title: 'Suppliers' },
    ],
  },
];

export const PosSidebar: React.FC<PosSidebarProps> = ({
  visible,
  onClose,
  activeItem,
  onSelectItem,
}) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    Sales: true,
    Products: true,
    Supplier: false,
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 flex-row bg-black/60">
        <SafeAreaView className="flex-1 flex-row">
          <View className="w-80 bg-[#0B1A30] flex-1 flex-col border-r border-[#162744]">
            {/* Header: POS Brand */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#14233D]">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-full bg-[#17253D] items-center justify-center border border-slate-700 shadow-sm">
                  <Text className="text-white font-extrabold text-xs tracking-wider">POS</Text>
                </View>
                <Text className="text-white font-black text-xl tracking-wider">
                  POS
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="p-1.5 rounded-lg bg-[#14243D] active:bg-[#1E3252]">
                <PosIcon name="menu" size={18} color="#94A3B8" />
              </Pressable>
            </View>

            {/* User profile & Logout */}
            <View className="px-5 py-3.5 border-b border-[#14233D] flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-full bg-slate-300 items-center justify-center">
                  <Text className="text-slate-800 font-bold text-xs">U</Text>
                </View>
                <Text className="text-slate-200 text-sm font-semibold">Logout</Text>
              </View>
              <Pressable className="p-1 rounded hover:bg-[#14243D]">
                <PosIcon name="log-out" size={17} color="#64748B" />
              </Pressable>
            </View>

            {/* Search box */}
            <View className="px-4 py-3 border-b border-[#14233D]/60">
              <View className="flex-row items-center bg-[#102038] rounded-lg px-3 py-2 border border-[#1A2E4E]">
                <Text className="text-slate-400 text-xs flex-1">Search</Text>
                <View className="bg-emerald-600 px-2 py-1.5 rounded-md">
                  <PosIcon name="search" size={12} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Menu List */}
            <ScrollView
              className="flex-1 px-3 py-2"
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}>
              {MENU_ITEMS.map((item) => {
                const isDirectActive = activeItem === item.id;
                const hasChildren = item.children && item.children.length > 0;
                const isChildActive =
                  hasChildren && item.children!.some((c) => c.id === activeItem);
                const isActive = isDirectActive || isChildActive;
                const isExpanded = !!expanded[item.id];

                return (
                  <View key={item.id} className="mb-1">
                    <Pressable
                      onPress={() => {
                        if (hasChildren) {
                          toggleExpand(item.id);
                          if (item.id === 'Sales') {
                            onSelectItem('Sales_List');
                            onClose();
                          }
                        } else {
                          onSelectItem(item.id);
                          onClose();
                        }
                      }}
                      className={`flex-row items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                        isDirectActive
                          ? 'bg-[#1D68E2] shadow-sm'
                          : 'active:bg-[#12233C]'
                      }`}>
                      <View className="flex-row items-center gap-3">
                        <PosIcon
                          name={item.icon}
                          size={17}
                          color={isDirectActive ? '#FFFFFF' : '#94A3B8'}
                        />
                        <Text
                          className={`text-sm ${
                            isDirectActive
                              ? 'text-white font-bold'
                              : isActive
                              ? 'text-white font-semibold'
                              : 'text-slate-300 font-medium'
                          }`}>
                          {item.title}
                        </Text>
                      </View>

                      {hasChildren ? (
                        <PosIcon
                          name={isExpanded ? 'chevron-down' : 'chevron-right'}
                          size={12}
                          color={isDirectActive ? '#FFFFFF' : '#64748B'}
                        />
                      ) : null}
                    </Pressable>

                    {/* Submenu Accordion */}
                    {hasChildren && isExpanded && (
                      <View className="pl-6 pr-2 py-1.5 flex-col gap-1 border-l border-[#192B48] ml-5 my-1">
                        {item.children!.map((child) => {
                          const isSubActive = activeItem === child.id;
                          return (
                            <Pressable
                              key={child.id}
                              onPress={() => {
                                onSelectItem(child.id);
                                onClose();
                              }}
                              className={`flex-row items-center gap-3 py-2 px-3 rounded-lg ${
                                isSubActive
                                  ? 'bg-[#1D68E2]/20 border border-[#1D68E2]/40'
                                  : 'active:bg-[#13243E]'
                              }`}>
                              {child.icon ? (
                                <PosIcon
                                  name={child.icon}
                                  size={13}
                                  color={isSubActive ? '#38BDF8' : '#64748B'}
                                />
                              ) : (
                                <View
                                  className={`w-3.5 h-3.5 rounded-full border-2 items-center justify-center ${
                                    isSubActive
                                      ? 'border-[#38BDF8] bg-[#38BDF8]/20'
                                      : 'border-[#475569]'
                                  }`}>
                                  {isSubActive && (
                                    <View className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                                  )}
                                </View>
                              )}

                              <Text
                                className={`text-xs ${
                                  isSubActive
                                    ? 'text-[#38BDF8] font-bold'
                                    : 'text-slate-300 font-medium'
                                }`}>
                                {child.title}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Dismiss overlay outside drawer */}
          <Pressable className="flex-1" onPress={onClose} />
        </SafeAreaView>
      </View>
    </Modal>
  );
};
