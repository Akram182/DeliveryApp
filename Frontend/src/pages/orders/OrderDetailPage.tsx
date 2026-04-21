import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrders';
import { Typography } from '@/components/ui';
import styles from '@/styles/finance.module.css';

function getStatusBadge(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('delivered') || s.includes('completed')) {
    return <span className={`${styles.statusBadge} ${styles.statusDelivered}`}>{status}</span>;
  }
  if (s.includes('confirmed') || s.includes('preparing')) {
    return <span className={`${styles.statusBadge} ${styles.statusConfirmed}`}>{status}</span>;
  }
  if (s.includes('cancelled') || s.includes('refunded')) {
    return <span className={`${styles.statusBadge} ${styles.statusCancelled}`}>{status}</span>;
  }
  return <span className={`${styles.statusBadge} ${styles.statusPending}`}>{status}</span>;
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>;
  }

  if (!order) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Order not found</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        ← Back to Orders
      </button>

      <div className={styles.orderDetailGrid}>
        <div className={styles.orderInfo}>
          <Typography variant="display" displayVariant="sub">
            Order #{order.id.slice(0, 8)}
          </Typography>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        <div className={styles.orderInfo}>
          <Typography variant="cardTitle">Items</Typography>
          <div className={styles.orderItems}>
            {order.items.map((item) => (
              <div key={item.productId} className={styles.orderItem}>
                <span className={styles.orderItemName}>{item.productName}</span>
                <span>x{item.quantity}</span>
                <span className={styles.orderItemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${(order.totalPrice - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Delivery</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}