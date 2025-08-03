import React, { useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { ScrollableNav } from 'components/containers';

import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
    let classNames = styles.tabLink || '';
    if (isActive) {
      classNames += ` ${styles.activeTabLink || ''}`;
    }
    return classNames.trim();
  };

  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector('a[aria-current="page"]') as HTMLElement;
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        setIndicatorStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
        });
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div>
      <ScrollableNav>
        <div className={styles.navContainer} ref={navRef}>
          <Nav
            variant='tabs'
            className={`${styles.customDashboardTabs || ''} mb-3 pt-2`}
            fill={false}
            justify={false}
          >
            <Nav.Item>
              <NavLink to='dishes' end className={getLinkClassName}>
                Pratos
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to='plates' className={getLinkClassName}>
                Controle de Louças
              </NavLink>
            </Nav.Item>
          </Nav>
          <div
            className={styles.activeIndicator}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </ScrollableNav>
      <div className={`${styles.tabContent} ${isTransitioning ? styles.transitioning : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
