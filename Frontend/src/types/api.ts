// DTOs derived from swagger.json. Keep names aligned with backend schema.

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegistrationDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  // Backend may return token in different envelope; we tolerate both.
  token?: string;
  accessToken?: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: "admin" | "customer" | string;
  balance?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
  imageUrl?: string | null;
  categoryId?: string;
  description?: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName?: string;
  imageUrl?: string | null;
  // Backend returns productPrice; we normalize to price on the client.
  price: number;
  productPrice?: number;
  quantity: number;
  deliveryFee?: number;
}

export interface Cart {
  items: CartItem[];
  total?: number;
  deliveryFee?: number;
}

export interface Address {
  id: string;
  city?: string;
  street?: string;
  building?: string;
  apartament?: string;
  comment?: string;
  leaveAtDoor?: boolean;
}

export interface CreateAddressDto {
  city?: string;
  street?: string;
  building?: string;
  apartament?: string;
  comment?: string;
  leaveAtDoor?: boolean;
}

export interface CreateOrderDto {
  pickupAddressId?: string;
  deliveryAddressId?: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  totalAmount?: number;
  deliveryFee?: number;
  createdAt: string;
  items: CartItem[];
  pickupAddress?: Address;
  deliveryAddress?: Address;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
}

export interface TopUpDto {
  amount: number;
}

export interface BalanceTransaction {
  id: string;
  amount: number;
  type?: string;
  createdAt: string;
  description?: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  image?: File | null;
}

export interface UpdateCategoryDto {
  id: string;
  name: string;
  description: string;
  image?: File | null;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  image?: File | null;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductDto extends CreateProductDto {
  id: string;
}

