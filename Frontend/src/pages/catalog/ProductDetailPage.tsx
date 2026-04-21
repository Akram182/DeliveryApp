import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/components/Toast';
import { Typography, Button } from '@/components/ui';
import styles from '@/styles/catalog.module.css';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      toast(`${product.name} added to cart`, 'success');
      navigate('/cart');
    } catch {
      toast('Failed to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.empty}>
        <Typography variant="body">Loading...</Typography>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.empty}>
        <Typography variant="body">Product not found</Typography>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        ← Back
      </button>

      <div className={styles.detailGrid}>
        <img
          className={styles.detailImage}
          src={
            product.imageUrl ||
            `https://placehold.co/600x480/e8ebe6/0e0f0c?text=${encodeURIComponent(product.name)}`
          }
          alt={product.name}
        />

        <div className={styles.addToCartSection}>
          <Typography variant="display" displayVariant="sub">
            {product.name}
          </Typography>

          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <span className={styles.stock}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className={styles.quantityRow}>
            <button
              className={styles.quantityBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              className={styles.quantityBtn}
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
          >
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}