import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser, useUpdateUser } from '@/hooks/useProfile';
import { toast } from '@/components/Toast';
import { Input, Button, Typography } from '@/components/ui';
import styles from '@/styles/profile.module.css';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { data: user, isLoading } = useUser();
  const methods = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  if (user && methods.getValues('firstName') !== user.firstName) {
    methods.reset({ firstName: user.firstName, lastName: user.lastName });
  }

  const { mutate: update, isPending } = useUpdateUser();

  const handleSubmit = (data: ProfileForm) => {
    update(data, {
      onSuccess: () => toast('Profile updated', 'success'),
      onError: () => toast('Failed to update profile', 'error'),
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.section}>
      <Typography variant="display" displayVariant="section">
        Profile
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.form}>
          <Typography variant="body">{user?.email}</Typography>
          <Input name="firstName" label="First Name" />
          <Input name="lastName" label="Last Name" />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}