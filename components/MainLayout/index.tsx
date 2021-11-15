import React, { FC } from 'react';
import Navbar from '../Navbar';

const MainLayout: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;
