import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Header title={title} />
        <div className="admin-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 