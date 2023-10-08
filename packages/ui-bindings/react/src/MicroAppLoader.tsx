import React from 'react';

const MicroAppLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return <>loading...</>;
  }

  return null;
};

export default MicroAppLoader;
