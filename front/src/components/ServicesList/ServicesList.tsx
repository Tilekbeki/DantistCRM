import { Typography, notification, Tabs, Radio, Space } from 'antd';
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

const { Text, Title } = Typography;

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

interface IService {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId: number;
  imageUrl?: string;
}

const ServicesList: React.FC = () => {
  const [selectedPersonal, setSelectedPersonal] = useState<IPersonal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const { data: personalsData, isLoading, error } = useGetPersonalsQuery();
  const categoriesList = useSelector(store => store.services.categoriesList);
  const services = useSelector(store => store.services.servicesList);

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

  // Функция для переключения раскрытия описания
  const toggleDescription = (serviceId: number) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Функция для форматирования длительности
  const formatDuration = (minutes: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} ч ${mins > 0 ? `${mins} мин` : ''}`;
    }
    return `${mins} мин`;
  };

  // Карточка услуги
  const ServiceCard: React.FC<{ service: IService }> = ({ service }) => {
    const isExpanded = expandedServices.has(service.id);
    const hasDescription = service.description && service.description.length > 0;
    
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-1">
          {/* Заголовок и цена */}
          <div className="flex justify-between items-start mb-4">
            <Title level={4} className="mb-0 text-gray-800 flex-1 mr-3">
              {service.name}
            </Title>
            {service.price && (
              <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
                {formatPrice(service.price)}
              </span>
            )}
          </div>

          {/* Иконки характеристик */}
          <div className="flex flex-wrap gap-3 mb-4">
            {service.duration && (
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{formatDuration(service.duration)}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Доступно</span>
            </div>
          </div>

          {/* Описание с кнопкой раскрытия */}
          {hasDescription && (
            <div className="mb-4">
              <div className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-2'} transition-all duration-300`}>
                {service.description}
              </div>
              
              <button
                onClick={() => toggleDescription(service.id)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
              >
                {isExpanded ? 'Скрыть' : 'Подробнее'}
                <svg 
                  className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Профессиональный специалист</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg">
            Редактировать
          </button>
          <button className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg">
            Удалить
          </button>
        </div>
      </div>
    );
  };

  console.log(services, 'услуги');

  return (
    <>
      {contextHolder}

   

          <Tabs
            defaultActiveKey="1"
            className="services-tabs"
            items={Object.keys(categoriesList).map(catNum => {
              const id = categoriesList[catNum].id;
              const categoryServices = Object.keys(services)
                .filter(serviceNum => services[serviceNum].categoryId === id)
                .map(serviceNum => services[serviceNum]);

              return {
                label: (
                  <div className="flex items-center space-x-2 px-4 py-2">
                    <span className="font-medium">{categoriesList[catNum].name}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full min-w-[28px] text-center">
                      {categoryServices.length}
                    </span>
                  </div>
                ),
                key: id.toString(),
                children: categoryServices.length > 0 ? (
                  <div className="mt-6">
                    {/* Сетка карточек */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryServices.map((service: IService) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <Title level={4} className="text-gray-500 mb-2">
                      Услуги не найдены
                    </Title>
                    <Text className="text-gray-400">
                      В этой категории пока нет доступных услуг
                    </Text>
                  </div>
                )
              };
            })}
            tabBarStyle={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          />

      {/* Модальное окно (оставлено на случай если понадобится) */}
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