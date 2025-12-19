import SideBar from "../components/SideBar";

type TemplatePageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  toggleModalState: () => void;
};

const TemplatePage = ({ title, description = '', toggleModalState, children }: TemplatePageProps) => {
  return (
    <div style={{display: "flex", gap: "40px"}}>
      <SideBar isCollapsed={false} />
      <div style={{padding: "10px 0"}}>
        <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {toggleModalState ? <div onClick={toggleModalState}>создать</div> : null}
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      {children}
      </div>
    </div>
  );
};

export default TemplatePage;
