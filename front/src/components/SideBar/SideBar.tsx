import {
  CreditCardOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useAppDispatch } from '../../store/hooks';
import { changePage } from '../../store/slices/pageSlice';

const { Sider } = Layout;

const SideBar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const dispatch = useAppDispatch();

  return (
    <Sider
      width={250}
      theme="light"
      trigger={null}
      collapsible
      collapsed={isCollapsed}
      style={{ height: '100vh', borderRight: '1px solid #e5e7eb' }}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-semibold text-foreground">Стоматология</h1>
      </div>

      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ border: 'none', padding: '1rem' }}
        items={[
          { key: '1', icon: <AppstoreOutlined />, label: 'Панель управления' },
          { key: '2', icon: <UserOutlined />, label: 'Пациенты' },
          { key: '5', icon: <CreditCardOutlined />, label: 'Карточка пациента' },
        ]}
        onClick={(e) => {
          const pageKeys: Record<string, string> = {
            '1': 'homePage',
            '2': 'patientsPage',
            '3': 'homePage',
            '4': 'homePage',
            '5': 'homePage',
          };
          dispatch(changePage(pageKeys[e.key]));
        }}
      />
    </Sider>
  );
};

export default SideBar;
