import React from 'react';
import { Layout, theme } from 'antd';
import SideBar from './components/SideBar';
import { PatientsPage, AppintmentsPage, MedicalCardsPage, SchedulePage, PersonalPage, HomePage, ServicesPage } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGetPatientsQuery } from './store/services/PatientApi';
import { useGetPersonalsQuery } from './store/services/PersonalApi';

const App: React.FC = () => {
  const { data, error, isLoading } = useGetPatientsQuery();
  const { personals } = useGetPersonalsQuery();
  console.log(data, personals, error, isLoading);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <BrowserRouter>
        <Layout>
          <SideBar isCollapsed={false} />
          <Layout.Content
            style={{
              margin: '0px 0px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppintmentsPage />} />
              <Route path="/medicalcards" element={<MedicalCardsPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/personal" element={<PersonalPage />} />
              <Route path="/services" element={<ServicesPage/>} />
            </Routes>
          </Layout.Content>
        </Layout>
      </BrowserRouter>
    </Layout>
  );
};

export default App;
