// ─────────────────────────────────────────────────────────────────────────────
// src/services/orders.ts
// All Supabase queries for orders.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import type { Order, CartItem, ShippingAddress, ServiceResult } from '@/types';

/** Create a new order. Called after successful Stripe payment. */
export async function createOrder(params: {
  userId: string;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  stripeSessionId?: string;
}): Promise<ServiceResult<Order>> {
    const { data, error } = await supabase.from('orders').insert({...}).select().single();
    .from('orders')
    .insert({
      user_id: params.userId,
      items: params.items,
      total: params.total,
      status: 'pending',
      shipping_address: params.shippingAddress,
      stripe_session_id: params.stripeSessionId ?? null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
    return { data, error: null };

/** Fetch all orders for the currently logged-in user. */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Admin: fetch all orders across all users. */
export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Admin: update an order's status. */
export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
}