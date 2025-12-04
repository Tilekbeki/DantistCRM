import { Table, Tag, Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useGetPersonalsQuery } from '../../store/services/PersonalApi';


const { Text } = Typography;

interface IPersonal {
  key: React.Key;
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  role: string;
  tg: string;
  email: string;
}


const PersonalList: React.FC = () => {
 const { data: personalsData, isLoading, error } = useGetPersonalsQuery();
 const personals = personalsData?.data?.allPersonal || [];


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
      render: (_, record) => record.email || <Text type="secondary">—</Text>
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (_, record) => record.phoneNumber || <Text type="secondary">—</Text>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => record.role || <Text type="secondary">—</Text>,
    },
    {
      title: 'Telegram',
      dataIndex: 'tgUsername',
      key: 'tgUsername',
      render: (_,record) =>
        record.tg ? (
          <Text>{record.tg}</Text>
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

  const data: IPersonal[] = personals.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
      <Table<IPersonal>
        columns={columns}
        dataSource={data}
        loading={isLoading}
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
