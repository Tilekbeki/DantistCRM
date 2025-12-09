import { Card } from 'antd';
import { Users, Calendar, UserCog, Activity } from 'lucide-react';
import TemplatePage from './TemplatePage';
import { useGetPatientsQuery } from '../store/services/PatientApi';
import { useGetPersonalsQuery } from '../store/services/PersonalApi';
import { useGetServicesQuery } from '../store/services/ServiceApi';
import { useEffect } from 'react';
import { addPatient, removePatient } from '../store/slices/patientSlice';
import { addPersonal } from '../store/slices/personalSlice';
import { useSelector,useDispatch } from 'react-redux';
import { addCategory, addService } from '../store/slices/serviceSlice';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
}) => (
  <Card className="w-[224px] h-[168px]">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="text-sm font-medium">{title}</div>
        <div>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs mt-1">{description}</p>
      </div>
    </div>
  </Card>
);

const HomePage = () => {
  const { data: patientsData, isLoading, error } = useGetPatientsQuery();
  const { data: personalsData } = useGetPersonalsQuery();
  const {data: servicesData} = useGetServicesQuery();
  const dispatch = useDispatch();
  const patients = patientsData?.data?.allPatients || [];
  const personals = personalsData?.data?.allPersonal || [];
  const services = servicesData?.data?.allServices || [];
  const categoriesList = servicesData?.data?.allCategories || {};

  console.log(services);

  useEffect(() => {
    if (patients.length > 0) {
      patients.forEach((patient) => {
        dispatch(addPatient(patient));
      });

      if (personals.length > 0) {
        personals.forEach((personal) => {
          dispatch(addPersonal(personal));
        });
      }
      if(services.length>0) {
        services.forEach((service) => {
          dispatch(addService(service));
        });
      }
      if(categoriesList.length > 0){
        categoriesList.forEach((category: any) => {
          dispatch(addCategory(category));
        });
      }
    }
  }, [personals, patients,services, categoriesList, dispatch]);

  const content = (
    <div className="flex gap-4 flex-wrap">
      <StatCard
        title="Всего пациентов"
        value={isLoading ? '...' : patients.length}
        description={isLoading ? 'Загрузка...' : `+0 за последний месяц`}
        icon={Users}
      />
      <StatCard title="Приемов сегодня" value={0} description="0 завершено, 0 запланировано" icon={Calendar} />
      <StatCard title="Врачей" value={isLoading ? '...' : personals.length} description="Все активны" icon={UserCog} />
      <StatCard title="Операций за месяц" value={0} description="+0% к прошлому месяцу" icon={Activity} />
    </div>
  );

  if (error) {
    return (
      <TemplatePage title="Панель управления" description="Ошибка загрузки данных">
        <div className="text-red-500">Ошибка: Не удалось загрузить данные пациентов</div>
      </TemplatePage>
    );
  }

  return (
    <TemplatePage
      title="Панель управления"
      description="Добро пожаловать в административную панель стоматологической клиники"
    >
      {content}
    </TemplatePage>
  );
};

export default HomePage;
