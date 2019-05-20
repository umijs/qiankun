/**
 * @author 有知 <youzhi.lk@antfin.com>
 * @since 2019-05-16
 */

import React from 'react';

export default function Framework(props) {

  const { content, loading } = props;

  function goto(title, href) {
    window.history.pushState({}, title, href);
  }

  return (
    <>
      <header>
        <nav>
          <ol>
            <li><a href="javascript: void 0" onClick={() => goto('react app', '/react')}>react</a></li>
            <li><a href="javascript: void 0" onClick={() => goto('vue app', '/vue')}>vue</a></li>
          </ol>
        </nav>
      </header>
      {loading ? <div>loading...</div> : null}
      <div dangerouslySetInnerHTML={{ __html: content }}/>
    </>

  );
}
