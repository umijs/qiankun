import React from 'react';
import styles from './index.less';
import { connect } from 'dva';

export default connect(state => ({
  foo: state.foo,
}))((props) => {
  return (
    <div>
      <h1 className={styles.title}>Page index { props.foo.desc } { props.foo.count }</h1>
    </div>
  );
})
