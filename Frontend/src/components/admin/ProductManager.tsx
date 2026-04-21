import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useAdminCategories';
import { toast } from '@/components/Toast';
import { Typography, Input, Button } from '@/components/ui';
import { Modal } from '@/components/admin';
import type { Product } from '@/types';
import styles from '@/styles/admin.module.css';

const productSchema = z.object({
  name: z.string().min(1).max(20),
  price: z.number().min(1).max(99999999),
  stock: z.number().min(1).max(999999),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

type ProductForm = z.infer<typeof productSchema>;

export function ProductManager() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const methods = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      isActive: true,
      imageUrl: '',
      categoryId: '',
    },
  });

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: update, isPending: updating } = useUpdateProduct();
  const { mutate: remove } = useDeleteProduct();

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditTarget(null);
    methods.reset({
      name: '',
      price: 0,
      stock: 0,
      isActive: true,
      imageUrl: '',
      categoryId: categories[0]?.id ?? '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditTarget(p);
    methods.reset({
      name: p.name,
      price: p.price,
      stock: p.stock,
      isActive: p.isActive,
      imageUrl: p.imageUrl ?? '',
      categoryId: p.categoryId,
    });
    setModalOpen(true);
  };

  const handleSubmit = (data: ProductForm) => {
    const body = {
      name: data.name,
      price: data.price,
      stock: data.stock,
      isActive: data.isActive,
      imageUrl: data.imageUrl || null,
      categoryId: data.categoryId,
    };

    if (editTarget) {
      update({ id: editTarget.id, ...body }, {
        onSuccess: () => {
          toast('Product updated', 'success');
          setModalOpen(false);
        },
        onError: () => toast('Failed to update', 'error'),
      });
    } else {
      create(body, {
        onSuccess: () => {
          toast('Product created', 'success');
          setModalOpen(false);
        },
        onError: () => toast('Failed to create', 'error'),
      });
    }
  };

  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: () => toast('Product deleted', 'success'),
      onError: () => toast('Failed to delete', 'error'),
    });
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <Typography variant="display" displayVariant="section">
          Products
        </Typography>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleOpenCreate}>+ Add Product</Button>
        </div>
      </div>

      {productsLoading ? (
        <p className={styles.noData}>Loading...</p>
      ) : (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.categoryName ?? p.categoryId}</td>
                <td>
                  <span
                    className={`${styles.activeBadge} ${p.isActive ? styles['activeBadge--true'] : styles['activeBadge--false']}`}
                  >
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleOpenEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.noData}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Product' : 'New Product'}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className={styles.modalForm}
          >
            <Input name="name" label="Name (max 20)" placeholder="Product name" />
            <Input name="price" type="number" label="Price" placeholder="0.00" />
            <Input name="stock" type="number" label="Stock" placeholder="0" />
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  marginBottom: '4px',
                }}
              >
                Category
              </label>
              <select
                className={styles.searchInput}
                style={{ width: '100%' }}
                {...methods.register('categoryId')}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Input name="imageUrl" label="Image URL" placeholder="https://..." />
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                {...methods.register('isActive')}
              />
              Active
            </label>
            <div className={styles.modalActions}>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
}