import React from 'react';
import { Layout, theme } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import {
  AppointmentsPage,
  AuthPage,
  HomePage,
  MedicalCardsPage,
  PatientCardPage,
  PatientsPage,
  PersonalPage,
  SchedulePage,
  ServicesPage,
} from './pages';

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <BrowserRouter>
        <Layout>
          <Layout.Content
            style={{
              margin: '0px 0px',
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/patients/:id" element={<PatientCardPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/medicalcards" element={<MedicalCardsPage />} />
                <Route path="/medicalcards/:id" element={<PatientCardPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/personal" element={<PersonalPage />} />
                <Route path="/services" element={<ServicesPage />} />
              </Route>
              <Route path="/login" element={<AuthPage />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </BrowserRouter>
    </Layout>
  );
};

export default App;
