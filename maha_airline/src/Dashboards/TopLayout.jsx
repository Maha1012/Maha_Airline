// Layout.jsx
import React from 'react';
import TopHeader from '../TopHeader';

const TopLayout = ({ children }) => {
  return (
    <>
      <TopHeader />
      {children}
    </>
  );
};

export default TopLayout;
