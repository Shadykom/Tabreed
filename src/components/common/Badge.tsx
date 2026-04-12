import styles from './Badge.module.scss';

type BadgeVariant = 'important' | 'scheduled' | 'announcement' | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
