import styles from './Avatar.module.scss';

const COLORS = [
  '#4A7FD4', '#2E5BA0', '#1B3A6B', '#14B8A6',
  '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <div className={`${styles.avatar} ${styles[size]}`}>
        <img className={styles.image} src={src} alt={name} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: getColor(name) }}
    >
      {initials}
    </div>
  );
}
