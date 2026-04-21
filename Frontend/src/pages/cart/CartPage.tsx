import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/components/Toast';
import { Typography, Button } from '@/components/ui';
import styles from '@/styles/cart.module.css';

export function CartPage() {
  const { cart, fetchCart, updateItem, removeItem, isLoading } = useCartStore();
  const { data: addresses } = useAddresses();
  const { mutate: createOrder, isPending: creating } = useCreateOrder();
  const navigate = useNavigate();

  const [pickupId, setPickupId] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setPickupId(addresses[0].id);
      setDeliveryId(addresses[addresses.length - 1].id);
    }
  }, [addresses]);

  const handleIncrement = async (itemId: string, currentQty: number) => {
    try {
      await updateItem(itemId, currentQty + 1);
    } catch {
      toast('Failed to update quantity', 'error');
    }
  };

  const handleDecrement = async (itemId: string, currentQty: number) => {
    if (currentQty <= 1) return;
    try {
      await updateItem(itemId, currentQty - 1);
    } catch {
      toast('Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeItem(itemId);
      toast('Item removed', 'success');
    } catch {
      toast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = () => {
    if (!pickupId || !deliveryId) {
      toast('Please add an address first', 'error');
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!pickupId || !deliveryId) return;
    createOrder({ pickupAddressId: pickupId, deliveryAddressId: deliveryId }, {
      onSuccess: () => {
        toast('Order placed!', 'success');
        navigate('/orders');
      },
      onError: () => {
        toast('Failed to place order. Check your balance.', 'error');
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.emptyCart}>
        <Typography variant="body">Loading cart...</Typography>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.totalPrice ?? 0;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <Typography variant="display" displayVariant="sub">
          Your cart is empty
        </Typography>
        <Button onClick={() => navigate('/catalog')} className={styles.checkoutBtn}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.itemsList}>
        <Typography variant="display" displayVariant="section">
          Cart
        </Typography>

        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img
              className={styles.itemImage}
              src={`https://placehold.co/80x80/e8ebe6/0e0f0c?text=${encodeURIComponent(item.productName)}`}
              alt={item.productName}
            />
            <div>
              <p className={styles.itemName}>{item.productName}</p>
              <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
            </div>
            <div className={styles.quantityControls}>
              <button
                className={styles.quantityBtn}
                onClick={() => handleDecrement(item.id, item.quantity)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className={styles.quantityValue}>{item.quantity}</span>
              <button
                className={styles.quantityBtn}
                onClick={() => handleIncrement(item.id, item.quantity)}
              >
                +
              </button>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => handleRemove(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <Typography variant="cardTitle">Order Summary</Typography>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Delivery</span>
          <span>$0.00</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {!showCheckout ? (
          <Button onClick={handleCheckout} className={styles.checkoutBtn}>
            Place Order
          </Button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem' }}>
              Pickup Address
              <select
                value={pickupId ?? ''}
                onChange={(e) => setPickupId(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(14,15,12,0.12)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                }}
              >
                {addresses?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {[a.street, a.building, a.city].filter(Boolean).join(', ')}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem' }}>
              Delivery Address
              <select
                value={deliveryId ?? ''}
                onChange={(e) => setDeliveryId(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(14,15,12,0.12)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                }}
              >
                {addresses?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {[a.street, a.building, a.city].filter(Boolean).join(', ')}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={handlePlaceOrder} disabled={creating || !pickupId || !deliveryId}>
              {creating ? 'Placing...' : 'Confirm Order'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowCheckout(false)}>
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}