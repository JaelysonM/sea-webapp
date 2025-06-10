import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';

import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    let classNames = styles.tabLink || '';
    if (isActive) {
      classNames += ` ${styles.activeTabLink || ''}`;
    }
    return classNames.trim();
  };

  return (
    <div>
      <Nav
        variant='tabs'
        className={`${styles.customDashboardTabs || ''} mb-3 pt-2`}
        fill={false}
        justify={false}
      >
        <Nav.Item>
          <NavLink to='plate' end className={getLinkClassName}>
            Meu prato
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to='menu' className={getLinkClassName}>
            Menu
          </NavLink>
        </Nav.Item>
      </Nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
