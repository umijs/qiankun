import { history, useLocation } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

export const Footer: React.FC = () => {
  const location = useLocation();

  function handleClick(url: string) {
    console.log(location, 'location');
    history.push(url);
  }

  return (
    <>
      <div className={styles['footer-container']}>
        <Button type="primary" onClick={() => handleClick('/')}>
          首页
        </Button>
        <Button type="primary" onClick={() => handleClick('/about')}>
          跳转到about页面
        </Button>
        <Button type="primary" onClick={() => handleClick('/table')}>
          跳转table页面
        </Button>
      </div>
    </>
  );
};
