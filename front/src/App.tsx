import React, { useEffect } from 'react';
import { Layout, theme } from 'antd';
import SideBar from './components/SideBar';
import { PatientsPage, AppintmentsPage, MedicalCardsPage, SchedulePage, PersonalPage, HomePage, ServicesPage, AuthPage } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useGetPatientsQuery } from './store/services/PatientApi';
import { useGetPersonalsQuery } from './store/services/PersonalApi';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { setAuth } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { data, error, isLoading } = useGetPatientsQuery();
  console.log(data, error, isLoading);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useAuth()



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
                <Route path="/appointments" element={<AppintmentsPage />} />
                <Route path="/medicalcards" element={<MedicalCardsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/personal" element={<PersonalPage />} />
                <Route path="/services" element={<ServicesPage/>} />
              </Route>
              
              
              <Route path='/login' element = {<AuthPage/>}/>
            </Routes>
          </Layout.Content>
        </Layout>
      </BrowserRouter>
    </Layout>
  );
};

export default App;
function dispatch(arg0: { payload: any; type: "auth/setAuth"; }) {
  throw new Error('Function not implemented.');
}

