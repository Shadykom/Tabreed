import type { ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  title?: string;
  viewAllText?: string;
  onViewAll?: () => void;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, viewAllText, onViewAll, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {title && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {viewAllText && (
            <button className={styles.viewAll} onClick={onViewAll}>
              {viewAllText}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
