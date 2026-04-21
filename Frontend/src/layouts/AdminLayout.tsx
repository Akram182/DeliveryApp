import type { ReactNode } from 'react';
import styles from '@/styles/admin.module.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.adminLayout}>
      <main className={styles.content}>{children}</main>
    </div>
  );
}