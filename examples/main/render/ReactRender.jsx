import React, {useEffect, useRef} from 'react';
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

function ElementRender(props) {

  const { loading, element } = props;

  const ref = useRef(null);
  useEffect(() => {
    if(element) {
      ref.current.appendChild(element);
    }
  }, [element]);

  return (
    <>
      {loading && (
        <h4 className="subapp-loading">Loading...</h4>
      )}
      <div ref={ref} />
    </>
  )
}

export default function render({ appContent, element, loading }) {
  const container = document.getElementById('subapp-container');
  ReactDOM.render(
    <ElementRender appContent={appContent} loading={loading} element={element} />,
    container,
  )
}
