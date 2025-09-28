import React from 'react';
import {
  CreditCardOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu} from 'antd';

const { Sider } = Layout;




const SideBar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
 

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed} style={{ height: '100vh', 'paddingTop':'10px' }}>
      <div className="demo-logo-vertical" />
    
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          { key: '1', icon: <UserOutlined />, label: 'Пользователи' },
          { key: '2', icon: <ScheduleOutlined />, label: 'Календарь' },
          { key: '3', icon: <UsergroupAddOutlined />, label: 'Врачи' },
          { key: '4', icon: <CreditCardOutlined />, label: 'Услуги' },
        ]}
      />
    </Sider>
  );
};

export default SideBar;
