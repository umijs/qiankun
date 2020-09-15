import React from 'react';

export default function() {
  function handleClick(e) {
    e.preventDefault();
    window.sayHello('i am react 16.');
  }
  return (
    <div>
      <h2 className="app-nav-item" style={{ borderColor: 'green' }}>
        About
      </h2>
      <button onClick={handleClick}>call parent</button>
    </div>
  );
}
