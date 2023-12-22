import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');

  return (
    <div className={styles.container}>
      <Guide name={trim(name)} />
    </div>
  );
};

export default HomePage;
