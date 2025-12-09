import TemplatePage from './TemplatePage';

import ServicesList from '../components/ServicesList';

const ServicesPage = () => {
  return (
    <TemplatePage title="Услуги" description="Управление услугами">
      <ServicesList />{' '}
    </TemplatePage>
  );
};

export default ServicesPage;
