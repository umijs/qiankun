import React from 'react';
import './index.less';

function goto(title, href) {
  return function (evt) {
    evt?.preventDefault();
    window.history.pushState({}, title, href);
  }
}

/**
 * 渲染子应用
 */
function SubApp(props) {
  const { content, loading } = props;
  return (
    <>
      <div className="mainapp-subapp">
        {loading && (
          <h4 className="mainapp-subapp-loading">Loading...</h4>
        )}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </>
  )
}

export default function Framework(props) {
  return (
    <div className="mainapp">
      {/* 标题栏 */}
      <header className="mainapp-header">
        <h1>QianKun</h1>
      </header>
      <div className="mainapp-main">
        {/* 侧边栏 */}
        <ul className="mainapp-sidemenu">
          <li onClick={goto('react16', '/react16')}>React16</li>
          <li onClick={goto('react15', '/react15')}>React15</li>
          <li onClick={goto('vue', '/vue')}>Vue</li>
          <li onClick={goto('angular9', '/angular9')}>Angular9</li>
        </ul>
        {/* 子应用 */}
        <SubApp {...props} />
      </div>
    </div>
  );
}
