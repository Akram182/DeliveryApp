import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { Typography, Button } from '@/components/ui';
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

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page, pageSize: 10 });
  const orders = data?.items ?? [];
  const total = data?.totalCount ?? 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <Typography variant="display" displayVariant="section">
        Orders
      </Typography>

      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={styles.orderRow}>
              <td>
                <Link to={`/orders/${order.id}`}>{order.id.slice(0, 8)}...</Link>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
          {orders.length === 0 && !isLoading && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '60px' }}>
                No orders yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isLoading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </Button>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}