import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { CategoryCard, ProductCard } from '@/components/catalog';
import { Typography, Button } from '@/components/ui';
import styles from '@/styles/catalog.module.css';

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const {
    data,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts({ category: selectedCategory!, chunkLength: 20 });

  const products = data?.pages.flatMap((p) => p.items) ?? [];

  if (!selectedCategory) {
    return (
      <div>
        <Typography variant="display" displayVariant="section">
          Categories
        </Typography>

        {categoriesLoading ? (
          <p className={styles.empty}>Loading categories...</p>
        ) : (
          <div className={styles.grid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onSelect={() => setSelectedCategory(cat.name)}
              />
            ))}
          </div>
        )}

        {!categoriesLoading && categories.length === 0 && (
          <p className={styles.empty}>No categories found</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setSelectedCategory(null)}
        className={styles.backLink}
      >
        ← Back to Categories
      </button>

      <Typography variant="display" displayVariant="section">
        {selectedCategory}
      </Typography>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {productsLoading ? (
        <p className={styles.empty}>Loading products...</p>
      ) : products.length === 0 ? (
        <p className={styles.empty}>No products found</p>
      ) : null}

      {hasNextPage && (
        <div className={styles.loadMore}>
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}