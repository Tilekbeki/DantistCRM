
import { useAppSelector } from '../../store/hooks';
import { Table, Tag, Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import {  PhoneOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface IPersonal {
  key: React.Key;
  id: number;
  name: string;
  surname: string;
}


const PersonalList: React.FC = () => {
 
  const { items: patients, loading } = useAppSelector((state) => state.patients);

 

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'green';
  //     case 'inactive':
  //       return 'red';
  //     case 'new':
  //       return 'blue';
  //     case 'examined':
  //       return 'orange';
  //     case 'treatment':
  //       return 'purple';
  //     case 'recovered':
  //       return 'green';
  //     default:
  //       return 'default';
  //   }
  // };


 

  // const getStatusText = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'Активен';
  //     case 'inactive':
  //       return 'Неактивен';
  //     case 'new':
  //       return 'Новый';
  //     case 'examined':
  //       return 'Осмотрен';
  //     case 'treatment':
  //       return 'На лечении';
  //     case 'recovered':
  //       return 'Выздоровел';
  //     default:
  //       return status;
  //   }
  // };

  const columns: TableColumnsType<IPersonal> = [
    {
      title: 'ФИО',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (_, record) => (
        <a href={`/patients/${record.id}`} className="font-semibold text-blue-600 hover:underline">
          {record.name} {record.surname}
        </a>
      ),
    },
     {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      render: (phone?: string) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phone?: string) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (phone?: string) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Специализация',
      dataIndex: 'occupation',
      key: 'occupation',
      render: (phone?: string) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Telegram',
      dataIndex: 'tgUsername',
      key: 'tgUsername',
      render: (tg?: string) =>
        tg ? (
          <Text>@{tg}</Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
     {
    title: 'Удалить',
    dataIndex: '',
    key: 'x',
    render: () => <a>Удалить</a>,
  },
  ];

  const data: IPersonal[] = patients.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
      <Table<IPersonal>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-3 bg-gray-50 rounded-md">
              <Space direction="vertical">
                {/* <Space>
                  <CalendarOutlined />
                  <Text>Дата создания: {new Date(record.createdAt).toLocaleDateString('ru-RU')}</Text>
                </Space> */}
                {/* {record.phone_number && (
                  <Space>
                    <PhoneOutlined />
                    <Text>Телефон: {record.phone_number}</Text>
                  </Space>
                )}
                {record.tgUsername && (
                  <Space>
                    <Text type="secondary">Telegram: @{record.tgUsername}</Text>
                  </Space>
                )}
                {record.address && (
                  <Space>
                    <Text type="secondary">Адрес: {record.address}</Text>
                  </Space>
                )} */}
              </Space>
            </div>
          ),
        }}
      />
  );
};

export default PersonalList;
