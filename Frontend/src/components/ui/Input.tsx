import type { InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './Input.module.css';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
}

export function Input({ name, label, ...props }: InputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            className={[styles.input, error ? styles['input--error'] : ''].join(' ')}
            {...field}
            {...props}
          />
        )}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}