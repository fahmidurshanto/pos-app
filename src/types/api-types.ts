export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  image: string | null;
  status: string;
  company: string;
  created_on: string;
  updated_on: string;
}

export interface Company {
  logo: string;
  organiz: string;
  colors: string;
  lat: string;
  lng: string;
}

export interface Privilege {
  roleid: string;
  role: string;
  details: string;
  var_name: string;
  mview: string;
  madd: string;
  medit: string;
  mdelete: string;
}

export interface LoginResponseData {
  employee: Employee;
  company: Company;
  privilise: Privilege[];
  role: string;
  roles: any[];
}

export interface DashboardData {
  stock_out: number[];
  stock_in: number[];
  purchase: number[];
  sale: number[];
  month: Record<string, string>;
}

export interface ApiCategory {
  id: string;
  category: string;
  status: string;
  company: string;
  types?: string;
  sequence?: string;
  created_on?: string;
  updated_on?: string;
}

export interface ApiSubCategory {
  id: string;
  category_id: string;
  subcat: string;
  status: string;
  company: string;
  sequence?: string;
  created_on?: string;
  updated_on?: string;
  category?: string;
}

export interface ApiUnit {
  id: string;
  unit: string;
  qty: string;
  company: string;
  status: string;
  created_on?: string;
  updated_on?: string;
}

export interface ApiBrand {
  id: string;
  brand: string;
  status: string;
  company: string;
  created_on?: string;
  updated_on?: string;
}

export interface ApiProduct {
  id: string;
  category_id: string;
  subcat_id: string;
  unit_id: string;
  brand_id: string;
  product: string;
  status: string;
  company: string;
  description: string;
  buy_price: string;
  margin: string;
  sale_price: string;
  sizes: any;
  image: string;
  thumb: string;
  supplier_id: string;
  barcode: string;
  sku: string;
  created_on: string;
  updated_on: string;
  supplier: string | null;
  unit: string;
  category: string;
  brand: string;
  stock: number;
}

export interface ApiSupplier {
  id?: string;
  RowID?: string | number;
  supplier: string;
  mobile: string;
  address: string;
  email: string;
  company: string;
  zip_code: string;
}

export interface ApiPurchaseItem {
  id: string;
  user_id: string;
  supplier_id: string;
  company: string;
  order_no: string;
  date: string;
  tax: string;
  status: string;
  discount: string;
  total_amount: string;
  note: string;
  paid: string;
  due: string;
  created_on: string;
  updated_on: string;
  supplier: string;
  worker: string;
}

export interface CreatePurchasePayload {
  supplier_id: string;
  date: string;
  note: string;
  paid: string;
  Due?: string;
  user_id?: string;
  company?: string;
  products: {
    product_id: string[];
    product: string[];
    sku: string[];
    brands: string[];
    units: string[];
    qty: string[];
    rate: string[];
    sale: string[];
    total: string[];
  };
}


