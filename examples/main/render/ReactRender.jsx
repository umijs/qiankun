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
  let subappContainer;
  const container = document.getElementById('subapp-container');
  if (container == null) {
    subappContainer = document.createElement('main');
    subappContainer.setAttribute('id', 'subapp-container');
    document.body.appendChild(subappContainer);
  }
  ReactDOM.render(<Render loading={loading} />, container || subappContainer);
}
                  
