import React, { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from '../App.js';

const AsyncComponent = ({ load }) => {
  const Component = React.lazy(load)
  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter({
  routes: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "about",
      element: <AsyncComponent load={() => import('../About.js')} />,
    },
  ],
  opts: {
    basename: window.__POWERED_BY_QIANKUN__ ? '/react18-webpack-sub' : '/'
  }
})

export default router
