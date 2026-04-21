import type { ReactNode } from 'react';
import styles from './Card.module.css';

type CardSize = 'sm' | 'md' | 'lg';
type CardBorder = 'ring' | 'bordered' | 'green-bordered';

interface CardProps {
  children: ReactNode;
  className?: string;
  size?: CardSize;
  border?: CardBorder;
}

export function Card({
  children,
  className = '',
  size = 'md',
  border = 'ring',
}: CardProps) {
  return (
    <div
      className={[
        styles.card,
        size === 'sm' ? styles['card--sm'] : '',
        size === 'lg' ? styles['card--lg'] : '',
        border === 'bordered' ? styles['card--bordered'] : '',
        border === 'green-bordered' ? styles['card--green-bordered'] : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}