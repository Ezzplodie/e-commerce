export type AdminOrderShipping = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  shipping_country: string | null;
  shipping_company: string | null;
  phone: string | null;
  city: string | null;
  shipping_apartmentment: string | null;
  address: string | null;
  postal_code: string | null;
};

export type AdminOrderListItem = {
  id: number;
  status: string;
  total_price: number | null;
  shipping_cost: number | null;
  item_count: number;
  created_at: string;
  shipping: AdminOrderShipping;
  user_id: number;
  customer_email: string | null;
};

export type AdminOrdersListResponse = {
  orders: AdminOrderListItem[];
  total: number;
  page: number;
  limit: number;
};

export type AdminOrderLineItem = {
  id: number;
  variant_id: number;
  product_id: number;
  sku_snapshot: string | null;
  product_name_snapshot: string | null;
  variant_name_snapshot: string | null;
  color_snapshot: string | null;
  size_snapshot: string | null;
  image_url_snapshot: string | null;
  currency: string | null;
  price: number | null;
  quantity: number;
  line_total: number | null;
};

export type AdminOrderWithItems = {
  id: number;
  status: string;
  total_price: number | null;
  shipping_cost: number | null;
  item_count: number;
  created_at: string;
  shipping: AdminOrderShipping;
  items: AdminOrderLineItem[];
};

/** Shape returned by PATCH /orders/:id/status (no customer_email). */
export type OrderStatusPatchResponse = {
  id: number;
  status: string;
  total_price: number | null;
  shipping_cost: number | null;
  item_count: number;
  created_at: string;
  shipping: AdminOrderShipping;
};
