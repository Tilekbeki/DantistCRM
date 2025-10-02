import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,AntDesignOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, ConfigProvider  } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store';
import { createStyles } from 'antd-style';
import SideBar from './components/SideBar';
const { Header, Content } = Layout;

import PatientsList from './components/Patients';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

   const { styles } = useStyle();

  return (
    <Layout>
      <Provider store={store}>
         <SideBar isCollapsed={collapsed}/>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>

          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
            <ConfigProvider
        button={{
          className: styles.linearGradientButton,
        }}
      >
        <Button type="primary" size="large" icon={<AntDesignOutlined />}>
        Добавить пациента
        </Button>
      </ConfigProvider>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <PatientsList/>
        </Content>
      </Layout>
      </Provider>
     
    </Layout>
  );
};

export default App;