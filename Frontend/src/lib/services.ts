import { api } from "./api";
import type {
  AddToCartDto,
  Address,
  AuthResponse,
  BalanceTransaction,
  Cart,
  CartItem,
  Category,
  CourierEarning,
  CourierProfile,
  CreateAddressDto,
  CreateCategoryDto,
  CreateCourierDto,
  CreateOrderDto,
  CreateProductDto,
  LoginDto,
  Order,
  Product,
  RegistrationDto,
  TopUpDto,
  UpdateAvailabilityDto,
  UpdateCartItemDto,
  UpdateCategoryDto,
  UpdateOrderStatusDto,
  UpdateProductDto,
  UpdateUserDto,
  User,
} from "@/types/api";

// Auth
export const authService = {
  login: (dto: LoginDto) => api.post<AuthResponse>("/api/Auth/login", dto).then((r) => r.data),
  register: (dto: RegistrationDto) =>
    api.post<AuthResponse>("/api/Auth/register", dto).then((r) => r.data),
  ping: () => api.get("/api/Auth/ping").then((r) => r.data),
};

// Catalog
interface CatalogEnvelope {
  categories: Category[] | null;
  products: Product[] | null;
}

export const catalogService = {
  categories: () =>
    api
      .get<CatalogEnvelope>("/api/Catalog/categories")
      .then((r) => r.data.categories ?? []),
  products: (params?: { category?: string; chunkLength?: number }) =>
    api
      .get<CatalogEnvelope>("/api/Catalog/products", {
        params: { chunkLength: 20, ...params },
      })
      .then((r) => r.data.products ?? []),
  Allproducts: (params?: { category?: string; chunkLength?: number }) =>
    api
      .get<CatalogEnvelope>("/api/Catalog/products/all", {
        params: { chunkLength: 20, ...params },
      })
      .then((r) => r.data.products ?? []),      
  product: (id: string) => api.get<Product>(`/api/Catalog/products/${id}`).then((r) => r.data),
};

// Customer
export const customerService = {
  me: () => api.get<User>("/api/Customer/users/me").then((r) => r.data),
  updateMe: (dto: UpdateUserDto) =>
    api.patch<User>("/api/Customer/users/me", dto).then((r) => r.data),

  addresses: () =>
    api.get<Address[]>("/api/Customer/users/me/addresses").then((r) => r.data),
  addAddress: (dto: CreateAddressDto) =>
    api.post<Address>("/api/Customer/users/me/addresses", dto).then((r) => r.data),
  removeAddress: (id: string) =>
    api.delete(`/api/Customer/users/me/addresses/${id}`).then((r) => r.data),

  cart: () =>
    api.get<Cart | CartItem[]>("/api/Customer/cart").then((r) => {
      // Backend may return either a bare array of items or a Cart envelope.
      const raw = Array.isArray(r.data) ? r.data : (r.data?.items ?? []);
      const items: CartItem[] = raw.map((it) => ({
        ...it,
        price: it.price ?? it.productPrice ?? 0,
      }));
      const deliveryFee = items.find((i) => i.deliveryFee != null)?.deliveryFee ?? 0;
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      return { items, total: subtotal, deliveryFee } as Cart;
    }),
  addToCart: (dto: AddToCartDto) =>
    api.post("/api/Customer/cart/items", dto).then((r) => r.data),
  updateCartItem: (id: string, dto: UpdateCartItemDto) =>
    api.patch(`/api/Customer/cart/items/${id}`, dto).then((r) => r.data),
  removeCartItem: (id: string) =>
    api.delete(`/api/Customer/cart/items/${id}`).then((r) => r.data),

  topUp: (dto: TopUpDto) =>
    api.post("/api/Customer/balance/top-up", dto).then((r) => r.data),
  balanceHistory: () =>
    api
      .get<BalanceTransaction[]>("/api/Customer/balance/history")
      .then((r) => r.data),

  orders: (params?: { page?: number; pageSize?: number }) =>
    api
      .get<Order[]>("/api/Customer/orders", {
        params: { page: 1, pageSize: 10, ...params },
      })
      .then((r) => (r.data ?? []).map(normalizeOrder)),
  order: (id: string) =>
    api.get<Order>(`/api/Customer/orders/${id}`).then((r) => normalizeOrder(r.data)),
  createOrder: (dto: CreateOrderDto) =>
    api.post<Order>("/api/Customer/orders", dto).then((r) => normalizeOrder(r.data)),
};

function normalizeOrder(o: Order): Order {
  const items = (o.items ?? []).map((it, idx) => ({
    ...it,
    id: it.id ?? `${o.id}:${it.productId ?? idx}`,
    price: it.price ?? it.productPrice ?? 0,
  }));
  return {
    ...o,
    items,
    total: o.total ?? o.totalAmount ?? 0,
  };
}

// Admin
interface AdminEnvelope {
  categories: Category[] | null;
  products: Product[] | null;
}

function categoryFormData(dto: CreateCategoryDto | UpdateCategoryDto) {
  const fd = new FormData();
  if ("id" in dto && dto.id) fd.append("Id", dto.id);
  fd.append("Name", dto.name);
  fd.append("Description", dto.description);
  if (dto.image) fd.append("Image", dto.image);
  return fd;
}

function productFormData(dto: CreateProductDto | UpdateProductDto) {
  const fd = new FormData();
  if ("id" in dto && dto.id) fd.append("Id", dto.id);
  fd.append("Name", dto.name);
  fd.append("Price", String(dto.price));
  fd.append("Stock", String(dto.stock));
  fd.append("IsActive", String(dto.isActive));
  fd.append("CategoryId", dto.categoryId);
  if (dto.image) fd.append("Image", dto.image);
  if ("id" in dto && dto.imageUrl) fd.append("ImageUrl", dto.imageUrl);
  return fd;
}

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const adminService = {
  categories: () =>
    api
      .get<AdminEnvelope>("/api/Admin/category")
      .then((r) => r.data.categories ?? []),
  createCategory: (dto: CreateCategoryDto) =>
    api
      .post<Category>("/api/Admin/category", categoryFormData(dto), multipart)
      .then((r) => r.data),
  updateCategory: (dto: UpdateCategoryDto) =>
    api
      .put<Category>("/api/Admin/category", categoryFormData(dto), multipart)
      .then((r) => r.data),
  removeCategory: (id: string) =>
    api.delete(`/api/Admin/category/${id}`).then((r) => r.data),

  products: () =>
    api
      .get<AdminEnvelope>("/api/Admin/product")
      .then((r) => r.data.products ?? []),
  createProduct: (dto: CreateProductDto) =>
    api
      .post<Product>("/api/Admin/product", productFormData(dto), multipart)
      .then((r) => r.data),
  updateProduct: (dto: UpdateProductDto) =>
    api
      .put<Product>("/api/Admin/product", productFormData(dto), multipart)
      .then((r) => r.data),
  removeProduct: (id: string) =>
    api.delete(`/api/Admin/product/${id}`).then((r) => r.data),

  createCourier: (dto: CreateCourierDto) =>
    api
      .post<{ message: string; id: string }>("/api/Admin/courier", dto)
      .then((r) => r.data),
};

// Courier
export const courierService = {
  profile: () =>
    api.get<CourierProfile>("/api/Courier/profile").then((r) => r.data),
  updateAvailability: (dto: UpdateAvailabilityDto) =>
    api
      .patch<{ message: string }>("/api/Courier/availability", dto)
      .then((r) => r.data),
  orders: (params?: { page?: number; pageSize?: number }) =>
    api
      .get<Order[]>("/api/Courier/orders", {
        params: { page: 1, pageSize: 10, ...params },
      })
      .then((r) => (r.data ?? []).map(normalizeOrder)),
  order: (id: string) =>
    api.get<Order>(`/api/Courier/orders/${id}`).then((r) => normalizeOrder(r.data)),
  acceptOrder: (id: string) =>
    api
      .post<Order>(`/api/Courier/orders/${id}/accept`)
      .then((r) => normalizeOrder(r.data)),
  updateOrderStatus: (id: string, dto: UpdateOrderStatusDto) =>
    api
      .patch<Order>(`/api/Courier/orders/${id}/status`, dto)
      .then((r) => normalizeOrder(r.data)),
  earnings: () =>
    api.get<CourierEarning[]>("/api/Courier/earnings").then((r) => r.data ?? []),
};
