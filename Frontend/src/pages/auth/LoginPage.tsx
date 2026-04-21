import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { Button, Typography, Input, Card } from '@/components/ui';
import styles from './auth.module.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginForm) => {
    mutate(data, {
      onSuccess: (response) => {
        setAuth(response.token, response.user);
        navigate('/');
      },
      onError: () => {
        methods.setError('root', { message: 'Invalid email or password' });
      },
    });
  };

  return (
    <div className={styles.authContainer}>
      <Card border="ring">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.authForm}>
            <Typography variant="display" displayVariant="sub" className={styles.authTitle}>
              Welcome
            </Typography>
            <Input name="email" type="email" label="Email" placeholder="email@example.com" autoComplete="email" />
            <Input name="password" type="password" label="Password" placeholder="Enter password" autoComplete="current-password" />
            {methods.formState.errors.root && (
              <div className={styles.authError}>{methods.formState.errors.root.message}</div>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </FormProvider>
        <div className={styles.authSwitch}>
          No account?{' '}
          <Link to="/register" className={styles.authSwitchLink}>
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}