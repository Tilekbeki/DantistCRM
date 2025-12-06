import TemplatePage from './TemplatePage';

import AppintmentList from '../components/AppintmentList';

const AppintmentsPage = () => {
  return (
    <TemplatePage title="Приемы" description="Управление записями приемов">
      <AppintmentList />{' '}
    </TemplatePage>
  );
};

export default AppintmentsPage;
