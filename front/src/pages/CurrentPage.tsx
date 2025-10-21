import { Layout, theme } from 'antd';
import { useAppSelector } from '../store/hooks';

import {HomePage, PatientsPage, PersonalPage, SchedulePage, AppintmentsPage} from './index';

const { Content } = Layout;

const CurrentPage: React.FC = () => {
    const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentPage = useAppSelector((state) => state.pages.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'patientsPage':
        return <PatientsPage />;
      case 'homePage':
        return <HomePage />;
      case 'SchedulePage':
        return <SchedulePage/>
      case 'PersonalPage':
        return <PersonalPage/>
      case 'AppintmentsPage':
        return <AppintmentsPage/>
      default:
        return <HomePage />;
    }
  };

  return (
    
       <Layout>
        <Content   style={{
            margin: '0px 0px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>{renderPage()}</Content>
      </Layout>
  );
};

export default CurrentPage;
