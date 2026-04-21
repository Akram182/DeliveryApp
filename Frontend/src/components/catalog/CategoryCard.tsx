import type { Category } from '@/types';
import styles from '@/styles/catalog.module.css';

interface CategoryCardProps {
  category: Category;
  onSelect: () => void;
}

export function CategoryCard({ category, onSelect }: CategoryCardProps) {
  return (
    <button
      onClick={onSelect}
      className={styles.card}
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={`https://placehold.co/400x300/e8ebe6/0e0f0c?text=${encodeURIComponent(category.name)}`}
          alt={category.name}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{category.name}</h3>
        <p className={styles.description}>{category.description}</p>
      </div>
    </button>
  );
}