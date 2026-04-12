import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import type { OrgMember } from '../../types';
import styles from './OrgChart.module.scss';

function OrgNode({ member, isRoot = false }: { member: OrgMember; isRoot?: boolean }) {
  return (
    <div className={styles.node}>
      <div className={`${styles.nodeCard} ${isRoot ? styles.root : ''}`}>
        <div className={styles.avatarWrap}>
          <Avatar name={member.name} src={member.avatar || undefined} size={isRoot ? 'md' : 'sm'} />
        </div>
        <div className={styles.nodeName}>{member.name}</div>
        <div className={styles.nodeTitle}>{member.title}</div>
      </div>

      {member.children && member.children.length > 0 && (
        <>
          <div className={styles.connector} />
          <div className={styles.children}>
            {member.children.map((child) => (
              <div key={child.id} className={styles.childBranch}>
                <OrgNode member={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrgChart() {
  const { t } = useTranslation();
  const { data: orgChart } = useApi<OrgMember>(api.getOrgChart);

  if (!orgChart) return null;

  return (
    <Card title={t('hierarchy.title')}>
      <div className={styles.tree}>
        <OrgNode member={orgChart} isRoot />
      </div>
    </Card>
  );
}
