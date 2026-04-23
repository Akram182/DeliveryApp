import { api } from "./api";
import type {
  AddToCartDto,
  Address,
  AuthResponse,
  BalanceTransaction,
  Cart,
  Category,
  CreateAddressDto,
  CreateCategoryDto,
  CreateOrderDto,
  CreateProductDto,
  LoginDto,
  Order,
  Product,
  RegistrationDto,
  TopUpDto,
  UpdateCartItemDto,
  UpdateCategoryDto,
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
export const catalogService = {
  categories: () => api.get<Category[]>("/api/Catalog/categories").then((r) => r.data),
  products: (params?: { category?: string; chunkLength?: number }) =>
    api
      .get<Product[]>("/api/Catalog/products", { params: {  ...params,chunkLength: 20 } })
      .then((r) => r.data),
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

  cart: () => api.get<Cart>("/api/Customer/cart").then((r) => r.data),
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
      .then((r) => r.data),
  order: (id: string) =>
    api.get<Order>(`/api/Customer/orders/${id}`).then((r) => r.data),
  createOrder: (dto: CreateOrderDto) =>
    api.post<Order>("/api/Customer/orders", dto).then((r) => r.data),
};

// Admin
export const adminService = {
  categories: () => api.get<Category[]>("/api/Admin/category").then((r) => r.data),
  createCategory: (dto: CreateCategoryDto) =>
    api.post<Category>("/api/Admin/category", dto).then((r) => r.data),
  updateCategory: (dto: UpdateCategoryDto) =>
    api.put<Category>("/api/Admin/category", dto).then((r) => r.data),
  removeCategory: (id: string) =>
    api.delete(`/api/Admin/category/${id}`).then((r) => r.data),

  products: () => api.get<Product[]>("/api/Admin/product").then((r) => r.data),
  createProduct: (dto: CreateProductDto) =>
    api.post<Product>("/api/Admin/product", dto).then((r) => r.data),
  updateProduct: (dto: UpdateProductDto) =>
    api.put<Product>("/api/Admin/product", dto).then((r) => r.data),
  removeProduct: (id: string) =>
    api.delete(`/api/Admin/product/${id}`).then((r) => r.data),
};
