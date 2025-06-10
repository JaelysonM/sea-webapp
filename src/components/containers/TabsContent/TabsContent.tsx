import React, { ReactNode } from 'react';

export interface TabItem {
  title: string;
  content: ReactNode;
}

export interface TabsContentProps {
  tabs: TabItem[];
}

const TabsContent: React.FC<TabsContentProps> = ({ tabs }) => {
  return <></>;
};

export default TabsContent;
