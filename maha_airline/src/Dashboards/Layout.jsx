// Layout.jsx

import React from 'react';
import Header from '../Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>{children}</div>
      {/* Add any additional layout elements or footers here */}
    </div>
  );
};

export default Layout;
