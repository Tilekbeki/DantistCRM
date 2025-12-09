import { Typography, notification,Tabs, Radio, Space } from 'antd';
import type { RadioChangeEvent, TabsProps } from 'antd';
import {
  useGetPersonalsQuery,
  useDeletePersonalMutation,
  useUpdatePersonalMutation,
} from '../../store/services/PersonalApi';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { personFields } from '../Fields/personalField';
import EntityModal from '../EntityModal/EntityModal';

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
  dateOfBirth: string;
}

const ServicesList: React.FC = () => {
  const [selectedPersonal, setSelectedPersonal] = useState<IPersonal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: personalsData, isLoading, error } = useGetPersonalsQuery();
  const categoriesList = useSelector(store=> store.services.categoriesList);
  const services = useSelector(store=>store.services.servicesList);

  type NotificationType = 'success';

  const [api, contextHolder] = notification.useNotification();

   const changeTabPlacement = (e: RadioChangeEvent) => {
    setTabPlacement(e.target.value);
  };

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      title: 'Success!',
      description: 'Обновление произошло успешно!',
    });
  };

  const openEditModal = (personal: IPersonal) => {
    setSelectedPersonal({
      ...personal,
      dateOfBirth: dayjs(personal.dateOfBirth),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPersonal(null);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedPersonal(null);
    }
  }, [isModalOpen]);

  const handleSubmit = (formData: formData) => {
    console.log(formData.dateOfBirth, 'дата', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    const formattedData = {
      ...formData,
      dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
    };

    console.log('Updated data:', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    updatePersonal({
      id: selectedPersonal?.id,
      input: formattedData,
    })
      .unwrap()
      .then(() => {
        openNotificationWithIcon('success');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении:', error);
      });

    handleModalClose();
  };

 

  // const data: IPersonal[] = personals.map((p) => ({
  //   key: p.id,
  //   ...p,
  // }));

console.log(services, 'услуги')
  return (
    <>
    {contextHolder}
      
      <>
      <Tabs
        items={Object.keys(categoriesList).map(catNum => {
          const id = categoriesList[catNum].id;
          const elements = Object.keys(services).map(serviceNum => {
            if(services[serviceNum].categoryId===id) return <div>{services[serviceNum].name}</div>
              
            });
          return {
            label: `${categoriesList[catNum].name}`,
            key: id,
            children: elements
          };
        })}
      />
    </>
      {/* <EntityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Редактирование персонала"
        fields={personFields}
        defaultValues={selectedPersonal || {}}
        buttonText="Сохранить изменения"
        onSubmit={handleSubmit}
        key={setSelectedPersonal?.id || 'modal'}
        hasDefaultValue={true}
      /> */}
    </>
  );
};

export default ServicesList;
