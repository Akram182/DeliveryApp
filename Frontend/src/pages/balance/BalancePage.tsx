import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBalance, useBalanceHistory, useTopUp } from '@/hooks/useBalance';
import { toast } from '@/components/Toast';
import { Input, Button, Typography } from '@/components/ui';
import styles from '@/styles/finance.module.css';

const topUpSchema = z.object({
  amount: z.number().min(1, 'Min $1').max(100000, 'Max $100,000'),
});

type TopUpForm = z.infer<typeof topUpSchema>;

const presets = [10, 50, 100, 500];

export function BalancePage() {
  const methods = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: 0 },
  });

  const { data: balance = 0 } = useBalance();
  const { data: history = [] } = useBalanceHistory();
  const { mutate: doTopUp, isPending } = useTopUp();

  const handleSubmit = (data: TopUpForm) => {
    doTopUp({ amount: data.amount }, {
      onSuccess: () => {
        toast(`Topped up $${data.amount}`, 'success');
        methods.reset({ amount: 0 });
      },
      onError: () => toast('Top-up failed', 'error'),
    });
  };

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>Current Balance</p>
          <p className={styles.balanceValue}>${balance.toFixed(2)}</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className={styles.topUpForm}>
            <p className={styles.sectionTitle}>Top Up</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {presets.map((p) => (
                <Button
                  key={p}
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => methods.setValue('amount', p)}
                >
                  ${p}
                </Button>
              ))}
            </div>
            <Input name="amount" type="number" label="Amount" placeholder="Enter amount" />
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Processing...' : 'Top Up'}
            </Button>
          </form>
        </FormProvider>
      </div>

      <div>
        <Typography variant="display" displayVariant="section" className={styles.sectionTitle}>
          Transaction History
        </Typography>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                <td className={item.type === 'top-up' ? styles.amountPositive : styles.amountNegative}>
                  {item.type === 'top-up' ? '+' : '-'}${Math.abs(item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }}>
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}