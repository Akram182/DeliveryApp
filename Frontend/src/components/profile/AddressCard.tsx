import type { Address } from '@/types';
import styles from '@/styles/profile.module.css';

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
}

export function AddressCard({ address, onDelete }: AddressCardProps) {
  const lines = [
    address.street,
    address.building,
    address.apartament,
    address.city,
  ].filter(Boolean);

  return (
    <div className={styles.addressCard}>
      {lines.map((line, i) =>
        line ? (
          <p key={i} className={styles.addressLine}>
            {line}
          </p>
        ) : null
      )}
      {address.comment && (
        <p className={styles.addressLine}>{address.comment}</p>
      )}
      {address.leaveAtDoor && (
        <p className={styles.addressLabel}>Leave at door</p>
      )}
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(address.id)}
      >
        ✕ Remove
      </button>
    </div>
  );
}