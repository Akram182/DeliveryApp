import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import styles from '@/styles/catalog.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/catalog/${product.id}`}
      className={styles.card}
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={product.imageUrl || `https://placehold.co/400x300/e8ebe6/0e0f0c?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <span className={styles.stock}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}