import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ title }) => {
  return (
    <div className="admin-header">
      <h1>{title}</h1>
      <div className="admin-header-actions">
        <Link to="/" className="view-site-link" target="_blank">
          <i className="fas fa-external-link-alt"></i> Перейти на сайт
        </Link>
      </div>
    </div>
  );
};

export default Header; 