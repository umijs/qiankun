// Type compatibility declarations for React 18 and Ant Design 5

declare module 'react' {
  // Fix for React 18 type compatibility
  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
  > {
    children?: ReactNode;
  }
}

declare module 'antd' {
  // Fix for Ant Design Layout component
  interface LayoutProps {
    children?: React.ReactNode;
  }

  // Fix for other Ant Design components
  interface ContentProps {
    children?: React.ReactNode;
  }
}

// Global JSX namespace fix
declare global {
  namespace JSX {
    interface Element {
      children?: React.ReactNode;
    }
  }
}

export {};
