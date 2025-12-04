import { Card } from "antd"
import { Users, Calendar, UserCog, Activity } from "lucide-react";
import TemplatePage from "./TemplatePage";
import { useGetPatientsQuery } from '../store/services/PatientApi'; 
import { useGetPersonalsQuery } from "../store/services/PersonalApi";
import { useAppDispatch } from "../store/hooks";
import { useEffect } from "react";
import { addPatient, removePatient } from '../store/slices/patientSlice'

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon 
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
        <div><Icon size={16}/></div>
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
  const {data: personalsData} = useGetPersonalsQuery();
   const dispatch = useAppDispatch()
  const patients = patientsData?.data?.allPatients || [];
  const personals = personalsData?.data?.allPersonal || [];
  console.log(personals)
  useEffect(() => {
    if (patients.length > 0) {
      patients.forEach(patient => {
        dispatch(addPatient(patient)) 
      })
    }
  }, [patients, dispatch]) // Добавил dispatch в зависимости

  const content = (
    <div className="flex gap-4 flex-wrap">
      <StatCard
        title="Всего пациентов"
        value={isLoading ? "..." : patients.length}
        description={isLoading ? "Загрузка..." : `+12 за последний месяц`}
        icon={Users}
      />
      <StatCard
        title="Приемов сегодня"
        value={0}
        description="3 завершено, 5 запланировано"
        icon={Calendar}
      />
      <StatCard
        title="Врачей"
        value={isLoading ? "..." : personals.length}
        description="Все активны"
        icon={UserCog}
      />
      <StatCard
        title="Операций за месяц"
        value={0}
        description="+0% к прошлому месяцу"
        icon={Activity}
      />
    </div>
  );

  // Показываем загрузку или ошибку
  if (error) {
    return (
      <TemplatePage 
        title="Панель управления" 
        description="Ошибка загрузки данных"
      >
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