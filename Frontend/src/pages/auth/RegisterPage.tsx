import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Button, Typography, Input, Card } from '@/components/ui';
import styles from './auth.module.css';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'At least one uppercase letter')
      .regex(/\d/, 'At least one digit')
      .regex(/[\W_]/, 'At least one special character'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
  })
  .refine((data) => data.password === data.password, {
    message: 'Passwords must match',
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const methods = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '' },
  });
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterForm) => {
    mutate(data, {
      onSuccess: (response) => {
        setAuth(response.token, response.user);
        navigate('/');
      },
      onError: () => {
        methods.setError('root', { message: 'Registration failed. Email may already be in use.' });
      },
    });
  };

  return (
    <div className={styles.authContainer}>
      <Card border="ring">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.authForm}>
            <Typography variant="display" displayVariant="sub" className={styles.authTitle}>
              Sign Up
            </Typography>
            <Input name="firstName" label="First Name" placeholder="John" autoComplete="given-name" />
            <Input name="lastName" label="Last Name" placeholder="Doe" autoComplete="family-name" />
            <Input name="email" type="email" label="Email" placeholder="email@example.com" autoComplete="email" />
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
              autoComplete="new-password"
            />
            {methods.formState.errors.root && (
              <div className={styles.authError}>{methods.formState.errors.root.message}</div>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </FormProvider>
        <div className={styles.authSwitch}>
          Already have an account?{' '}
          <Link to="/login" className={styles.authSwitchLink}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}