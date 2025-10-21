import React from 'react';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, ConfigProvider } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ruRU from 'antd/es/locale/ru_RU';
import TemplatePage from './TemplatePage';

dayjs.locale('ru');

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'Предупреждение' },
        { type: 'success', content: 'Обычное событие' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'Предупреждение' },
        { type: 'success', content: 'Обычное событие' },
        { type: 'error', content: 'Ошибка' },
      ];
      break;
    default:
  }
  return listData;
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const SchedulePage: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Количество задач</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
  
    <TemplatePage title="Расписание" description="Просмотр и управление расписанием">
       <div >
         <ConfigProvider locale={ruRU}>
          <Calendar style={{width: '80%'}} cellRender={cellRender} />
        </ConfigProvider>
       </div>
    </TemplatePage>
  );
};

export default SchedulePage;
