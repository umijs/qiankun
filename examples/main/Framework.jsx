/**
 * @author 有知 <youzhi.lk@antfin.com>
 * @since 2019-05-16
 */

import React from 'react';

export default function Framework(props) {

  const { content, loading } = props;

  return (
    <>
      {loading ? <div>loading...</div> : null}
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </>

  );
}
