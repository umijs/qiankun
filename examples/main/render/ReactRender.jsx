import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 渲染子应用
 */
function Render(props) {
  const { loading } = props;

  return (
    <>
      {loading && <h4 className="subapp-loading">Loading...</h4>}
      <div id="subapp-viewport" />
    </>
  );
}

export default function render({ loading }) {
  const container = document.getElementById('subapp-container');
  ReactDOM.render(<Render loading={loading} />, container);
}
