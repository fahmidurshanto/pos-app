export interface KPICardData {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badgeType: 'positive' | 'warning' | 'danger';
  iconBg: string;
  iconColor: string;
}

export const KPI_DATA: KPICardData[] = [
  {
    id: 'total-products',
    title: 'Total Products',
    value: '2,450',
    subtitle: '12.5% this month',
    badgeType: 'positive',
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
  },
  {
    id: 'stock-value',
    title: 'Total Stock Value',
    value: '$84,250',
    subtitle: '8.2% this month',
    badgeType: 'positive',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
  },
  {
    id: 'low-stock',
    title: 'Low Stock Items',
    value: '48',
    subtitle: 'Need restocking',
    badgeType: 'warning',
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
  },
  {
    id: 'out-of-stock',
    title: 'Out of Stock',
    value: '12',
    subtitle: 'Requires attention',
    badgeType: 'danger',
    iconBg: '#FEE2E2',
    iconColor: '#EF4444',
  },
];

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const RECENT_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'MacBook Pro 14"',
    sku: 'PRD-001',
    category: 'Electronics',
    stock: 45,
    price: '$1,499',
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'PRD-002',
    category: 'Accessories',
    stock: 8,
    price: '$25',
    status: 'Low Stock',
  },
  {
    id: '3',
    name: 'Samsung Monitor',
    sku: 'PRD-003',
    category: 'Electronics',
    stock: 32,
    price: '$320',
    status: 'In Stock',
  },
  {
    id: '4',
    name: 'USB Keyboard',
    sku: 'PRD-004',
    category: 'Accessories',
    stock: 0,
    price: '$45',
    status: 'Out of Stock',
  },
  {
    id: '5',
    name: 'HP Printer',
    sku: 'PRD-005',
    category: 'Office',
    stock: 65,
    price: '$210',
    status: 'In Stock',
  },
];

export interface LowStockAlertItem {
  id: string;
  title: string;
  sku: string;
  leftCount: number;
}

export const LOW_STOCK_ALERTS: LowStockAlertItem[] = [
  { id: '1', title: 'Wireless Mouse', sku: 'SKU-002', leftCount: 8 },
  { id: '2', title: 'USB Keyboard', sku: 'SKU-004', leftCount: 0 },
  { id: '3', title: 'Headphones', sku: 'SKU-008', leftCount: 5 },
  { id: '4', title: 'Smart Watch', sku: 'SKU-012', leftCount: 3 },
];

export const MONTHLY_SALES_DATA = [
  { month: 'Jan', sales: 0.65, purchases: 0.45 },
  { month: 'Feb', sales: 0.8, purchases: 0.5 },
  { month: 'Mar', sales: 0.55, purchases: 0.7 },
  { month: 'Apr', sales: 0.9, purchases: 0.6 },
  { month: 'May', sales: 0.75, purchases: 0.55 },
  { month: 'Jun', sales: 0.85, purchases: 0.65 },
  { month: 'Jul', sales: 0.7, purchases: 0.4 },
  { month: 'Aug', sales: 0.95, purchases: 0.75 },
  { month: 'Sep', sales: 0.6, purchases: 0.5 },
  { month: 'Oct', sales: 0.8, purchases: 0.6 },
  { month: 'Nov', sales: 0.85, purchases: 0.7 },
  { month: 'Dec', sales: 1.0, purchases: 0.8 },
];

export const CATEGORY_PIE_DATA = [
  { name: 'Electronics', percentage: 40, color: '#6366F1' },
  { name: 'Accessories', percentage: 25, color: '#10B981' },
  { name: 'Office', percentage: 15, color: '#F59E0B' },
  { name: 'Furniture', percentage: 12, color: '#EF4444' },
  { name: 'Others', percentage: 8, color: '#8B5CF6' },
];

