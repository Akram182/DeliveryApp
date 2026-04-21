import type { ReactNode, ElementType } from 'react';

type DisplayVariant = 'mega' | 'hero' | 'section' | 'sub';
type TextVariant = 'body' | 'bodySemibold' | 'button' | 'cardTitle' | 'featureTitle' | 'caption' | 'small';

interface TypographyProps {
  variant?: 'display' | TextVariant;
  displayVariant?: DisplayVariant;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Typography({
  variant = 'body',
  displayVariant,
  children,
  className = '',
  as: Tag = 'p',
}: TypographyProps) {
  const baseClass =
    variant === 'display' ? 'typography-display' : `typography-${variant}`;

  const sizeClass =
    variant === 'display' && displayVariant
      ? `typography-display-${displayVariant}`
      : undefined;

  return (
    <Tag
      className={[baseClass, sizeClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}