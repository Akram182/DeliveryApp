import { ProfileSection } from '@/components/profile/ProfileSection';
import { AddressManager } from '@/components/profile/AddressManager';
import styles from '@/styles/profile.module.css';

export function ProfilePage() {
  return (
    <div className={styles.profilePage}>
      <ProfileSection />
      <AddressManager />
    </div>
  );
}