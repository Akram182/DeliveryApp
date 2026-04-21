import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddresses, useCreateAddress, useDeleteAddress } from '@/hooks/useAddresses';
import { toast } from '@/components/Toast';
import { Input, Button } from '@/components/ui';
import { AddressCard } from '@/components/profile/AddressCard';
import styles from '@/styles/profile.module.css';

const addressSchema = z.object({
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  building: z.string().min(1, 'Building is required'),
  apartament: z.string(),
  comment: z.string(),
  leaveAtDoor: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export function AddressManager() {
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      city: '',
      street: '',
      building: '',
      apartament: '',
      comment: '',
      leaveAtDoor: false,
    },
  });

  const [showForm, setShowForm] = useState(false);
  const { data: addresses, isLoading } = useAddresses();
  const { mutate: create, isPending: creating } = useCreateAddress();
  const { mutate: remove } = useDeleteAddress();

  const handleSubmit = methods.handleSubmit((data) => {
    create(
      {
        city: data.city || null,
        street: data.street || null,
        building: data.building || null,
        apartament: data.apartament || null,
        comment: data.comment || null,
        leaveAtDoor: data.leaveAtDoor,
      },
      {
        onSuccess: () => {
          toast('Address added', 'success');
          methods.reset();
          setShowForm(false);
        },
        onError: () => {
          toast('Failed to add address', 'error');
        },
      }
    );
  });

  const handleDelete = (id: string) => {
    remove(id, {
      onSuccess: () => toast('Address removed', 'success'),
      onError: () => toast('Failed to remove address', 'error'),
    });
  };

  return (
    <div className={styles.section}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.addressGrid}>
          {addresses?.map((addr) => (
            <AddressCard key={addr.id} address={addr} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {!showForm ? (
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          + Add Address
        </Button>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className={styles.addForm}>
            <p className={styles.addFormTitle}>New Address</p>
            <div className={styles.twoCol}>
              <Input name="city" label="City" placeholder="Moscow" />
              <Input name="street" label="Street" placeholder="Tverskaya" />
            </div>
            <div className={styles.twoCol}>
              <Input name="building" label="Building" placeholder="1" />
              <Input name="apartament" label="Apartment" placeholder="42" />
            </div>
            <Input name="comment" label="Comment" placeholder="Gate code, instructions..." />
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                {...methods.register('leaveAtDoor')}
              />
              Leave at door
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type="submit" disabled={creating}>
                {creating ? 'Adding...' : 'Save Address'}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}