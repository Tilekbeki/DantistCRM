import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,AntDesignOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, ConfigProvider  } from 'antd';

import { createStyles } from 'antd-style';
import SideBar from './components/SideBar';
const { Content } = Layout;
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

import PatientsList from './components/PatientsList';
import { useAppSelector } from './store/hooks';
import CurrentPage from './pages/CurrentPage';

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
  const { currentPage } = useAppSelector((state) => state.pages);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  console.log(currentPage)

   const { styles } = useStyle();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar isCollapsed={false} />
      <CurrentPage/>
    </Layout>
   
  );
};

export default App;