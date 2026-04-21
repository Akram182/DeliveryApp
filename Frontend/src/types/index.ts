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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TopUpDto {
  amount: number;
}

export interface CreateAddressDto {
  city: string | null;
  street: string | null;
  building: string | null;
  apartament: string | null;
  comment: string | null;
  leaveAtDoor: boolean;
}

export interface Address {
  id: string;
  city: string | null;
  street: string | null;
  building: string | null;
  apartament: string | null;
  comment: string | null;
  leaveAtDoor: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: string;
  categoryName?: string;
}

export interface Order {
  id: string;
  status: string;
  totalPrice: number;
  deliveryFee: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
}

export interface UpdateCategoryDto {
  id: string;
  name: string;
  description: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: string;
}

export interface UpdateProductDto {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: string;
}

export interface CreateOrderDto {
  pickupAddressId: string;
  deliveryAddressId: string;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
}

export interface BalanceHistory {
  id: string;
  amount: number;
  type: 'top-up' | 'order';
  createdAt: string;
}