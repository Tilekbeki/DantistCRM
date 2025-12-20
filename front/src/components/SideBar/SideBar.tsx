import {
  UnorderedListOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  UserOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { changePage } from '../../store/slices/pageSlice';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Изменили импорт
import { clearAuth } from '../../store/slices/authSlice';
import { deleteCookie } from '../../hooks/useParseJwt';

const { Sider } = Layout;

const SideBar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // Добавили хук для навигации

  const selectedKey = (() => {
    if (location.pathname === '/') return '1';
    if (location.pathname === '/patients') return '2';
    if (location.pathname === '/personal') return '3';
    if (location.pathname === '/schedule') return '4';
    if (location.pathname === '/appointments') return '5';
    if (location.pathname === '/medicalcards') return '6';
    if (location.pathname === '/services') return '7'; // Добавили для services
    return '';
  })();

  const onLogoutHandler = () => {
    deleteCookie('access_token');
    dispatch(clearAuth()); // dispatch нужен для Redux экшена
    navigate('/login', { replace: true }); // Используем navigate для перехода
  }

  return (
    <Sider
      width={250}
      theme="light"
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      style={{ height: '100vh', borderRight: '1px solid #e5e7eb' }}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <h1 className="text-xl font-semibold text-foreground">Стоматология</h1>
        <button 
          onClick={onLogoutHandler}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Выйти
        </button>
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ border: 'none', padding: '1rem' }}
        items={[
          {
            key: '1',
            icon: <AppstoreOutlined />,
            label: <NavLink to="/">Главная</NavLink>,
          },
          {
            key: '2',
            icon: <UserOutlined />,
            label: <NavLink to="/patients">Пациенты</NavLink>,
          },
          {
            key: '3',
            icon: <UsergroupAddOutlined />,
            label: <NavLink to="/personal">Персонал</NavLink>,
          },
          {
            key: '4',
            icon: <ScheduleOutlined />,
            label: <NavLink to="/schedule">Расписание</NavLink>,
          },
          {
            key: '5',
            icon: <UnorderedListOutlined />,
            label: <NavLink to="/appointments">Приемы</NavLink>,
          },
          {
            key: '6',
            icon: <IdcardOutlined />,
            label: <NavLink to="/medicalcards">Мед. карта</NavLink>,
          },
          {
            key: '7',
            icon: <IdcardOutlined />,
            label: <NavLink to="/services">Услуги</NavLink>,
          },
        ]}
        onClick={(e) => {
          const pageKeys: Record<string, string> = {
            '1': 'homePage',
            '2': 'patientsPage',
            '3': 'personalPage',
            '4': 'schedulePage',
            '5': 'appointmentsPage',
            '6': 'medicalCardsPage',
            '7': 'servicesPage', // Добавили для services
          };
          dispatch(changePage(pageKeys[e.key]));
        }}
      />
    </Sider>
  );
};

export default SideBar;