import { Card } from 'antd';
import { Activity, Calendar, UserCog, Users } from 'lucide-react';

import { useGetAppointmentsQuery } from '../store/services/AppointmentsApi';
import { useGetPatientsQuery } from '../store/services/PatientApi';
import { useGetPersonalsQuery } from '../store/services/PersonalApi';
import TemplatePage from './TemplatePage';

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}) => (
  <Card className="w-[224px] h-[168px]">
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="text-sm font-medium">{title}</div>
        <Icon size={16} />
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
  const { data: appointmentsData } = useGetAppointmentsQuery();

  const patients = patientsData?.data?.allPatients || [];
  const personals = personalsData?.data?.allPersonal || [];
  const appointments = appointmentsData?.data?.allAppointments || [];
  const todayAppointments = appointments.filter((appointment) =>
    appointment.visitDate?.startsWith(new Date().toISOString().slice(0, 10)),
  );

  if (error) {
    return (
      <TemplatePage title="Дашборд" description="Ошибка загрузки данных">
        <div className="text-red-500">Не удалось загрузить данные дашборда</div>
      </TemplatePage>
    );
  }

  return (
    <TemplatePage
      title="Панель управления"
      description="Краткая операционная сводка стоматологической клиники"
    >
      <div className="flex gap-4 flex-wrap">
        <StatCard
          title="Всего пациентов"
          value={isLoading ? '...' : patients.length}
          description="Пациенты в базе CRM"
          icon={Users}
        />
        <StatCard
          title="Приемов сегодня"
          value={todayAppointments.length}
          description="Запланированные и завершенные приемы"
          icon={Calendar}
        />
        <StatCard
          title="Сотрудников"
          value={personals.length}
          description="Врачи и персонал клиники"
          icon={UserCog}
        />
        <StatCard
          title="Всего приемов"
          value={appointments.length}
          description="История и будущие записи"
          icon={Activity}
        />
      </div>
    </TemplatePage>
  );
};

export default HomePage;
