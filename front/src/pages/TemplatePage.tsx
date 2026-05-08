import { Button, Space } from 'antd';

import SideBar from '../components/SideBar';

type TemplatePageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  toggleModalState?: () => void;
  createButtonText?: string;
};

const TemplatePage = ({
  title,
  description = '',
  toggleModalState,
  createButtonText = 'Создать',
  children,
}: TemplatePageProps) => {
  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      <SideBar isCollapsed={false} />
      <main style={{ padding: '16px 24px 24px 0', width: '100%' }}>
        <Space align="start" style={{ justifyContent: 'space-between', width: '100%' }}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
          {toggleModalState ? (
            <Button type="primary" onClick={toggleModalState}>
              {createButtonText}
            </Button>
          ) : null}
        </Space>
        {children}
      </main>
    </div>
  );
};

export default TemplatePage;
