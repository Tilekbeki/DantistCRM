type TemplatePageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  toggleModalState: () => void;
};

const TemplatePage = ({ title, description = '',toggleModalState, children }: TemplatePageProps) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <div onClick={toggleModalState}>создать</div>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default TemplatePage;