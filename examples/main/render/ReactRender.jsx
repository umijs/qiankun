import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 渲染子应用
 */
function Render(props) {
  const { appContent, loading } = props;

  return (
    <>
      {loading && (
        <h4 className="subapp-loading">Loading...</h4>
      )}
      <div dangerouslySetInnerHTML={{ __html: appContent }} />
    </>
  )
}

export default function render({ appContent, loading }) {
  const container = document.getElementById('subapp-container');
  ReactDOM.render(
    <Render appContent={appContent} loading={loading} />,
    container,
  )
}
