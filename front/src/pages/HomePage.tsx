import { Card } from "antd"

const HomePage = () => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">Панель управления</h2>
            <p class="text-muted-foreground mt-2">Добро пожаловать в административную панель стоматологической клиники</p>
            </div>
            <div className="flex gap-4">
            <Card className="w-[224px] h-[168px]">Card content</Card>
            <Card className="w-[224px] h-[168px]">Card content</Card>
            <Card className="w-[224px] h-[168px]">Card content</Card>
        </div>
        </div>
    )
};

export default HomePage;