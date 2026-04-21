import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CategoryManager, ProductManager } from '@/components/admin';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/Toast';
import styles from '@/styles/admin.module.css';

type Tab = 'categories' | 'products';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast('Logged out', 'info');
    navigate('/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <p className={styles.sidebarTitle}>Admin</p>
        <button
          className={`${styles.sidebarLink} ${activeTab === 'categories' ? styles['sidebarLink--active'] : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`${styles.sidebarLink} ${activeTab === 'products' ? styles['sidebarLink--active'] : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <Link to="/" className={styles.sidebarLink}>
            ← Back to App
          </Link>
          <button onClick={handleLogout} className={styles.sidebarLink}>
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.content}>
        {activeTab === 'categories' ? <CategoryManager /> : null}
        {activeTab === 'products' ? <ProductManager /> : null}
      </main>
    </div>
  );
}