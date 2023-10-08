import React from 'react';

const ErrorBoundary: React.FC<{ error: Error }> = ({ error }) => <div>{error?.message}</div>;

export default ErrorBoundary;
