import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useAdminCategories';
import { toast } from '@/components/Toast';
import { Typography, Input, Button } from '@/components/ui';
import { Modal } from '@/components/admin';
import type { Category } from '@/types';
import styles from '@/styles/admin.module.css';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
});

type CategoryForm = z.infer<typeof categorySchema>;

export function CategoryManager() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const methods = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '' },
  });

  const { data: categories = [], isLoading } = useCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();
  const { mutate: remove } = useDeleteCategory();

  const filtered = categories.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditTarget(null);
    methods.reset({ name: '', description: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditTarget(cat);
    methods.reset({ name: cat.name, description: cat.description });
    setModalOpen(true);
  };

  const handleSubmit = (data: CategoryForm) => {
    if (editTarget) {
      update(
        { id: editTarget.id, ...data },
        {
          onSuccess: () => {
            toast('Category updated', 'success');
            setModalOpen(false);
          },
          onError: () => toast('Failed to update', 'error'),
        }
      );
    } else {
      create(data, {
        onSuccess: () => {
          toast('Category created', 'success');
          setModalOpen(false);
        },
        onError: () => toast('Failed to create', 'error'),
      });
    }
  };

  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: () => toast('Category deleted', 'success'),
      onError: () => toast('Failed to delete', 'error'),
    });
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <Typography variant="display" displayVariant="section">
          Categories
        </Typography>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleOpenCreate}>+ Add Category</Button>
        </div>
      </div>

      {isLoading ? (
        <p className={styles.noData}>Loading...</p>
      ) : (
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleOpenEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Category' : 'New Category'}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className={styles.modalForm}
          >
            <Input name="name" label="Name" placeholder="Category name" />
            <Input
              name="description"
              label="Description"
              placeholder="Category description"
            />
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