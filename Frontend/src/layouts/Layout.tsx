import { useNavigate, Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Typography } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/Toast';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useCartStore((s) => s.cart);
  const { clearAuth } = useAuthStore();

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const handleLogout = () => {
    clearAuth();
    toast('Logged out', 'info');
    navigate('/login');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            DeliveryApp
          </Link>
          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.navLink} ${location.pathname === '/' ? styles['navLink--active'] : ''}`}
            >
              Catalog
            </Link>
            <Link
              to="/balance"
              className={`${styles.navLink} ${location.pathname === '/balance' ? styles['navLink--active'] : ''}`}
            >
              Balance
            </Link>
            <Link
              to="/orders"
              className={`${styles.navLink} ${location.pathname === '/orders' ? styles['navLink--active'] : ''}`}
            >
              Orders
            </Link>
            <Link
              to="/profile"
              className={`${styles.navLink} ${location.pathname === '/profile' ? styles['navLink--active'] : ''}`}
            >
              Profile
            </Link>
            <Link
              to="/cart"
              className={`${styles.cartBtn} ${location.pathname === '/cart' ? styles['navLink--active'] : ''}`}
            >
              Cart
              {itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount}</span>
              )}
            </Link>
            <button onClick={handleLogout} className={styles.navLink}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <Typography variant="caption">DeliveryApp</Typography>
      </footer>
    </>
  );
}