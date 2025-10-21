
import PersonalList from "../components/PersonalList";
import TemplatePage from "./TemplatePage";

const PersonalPage = () => {
    return (
     
        <TemplatePage title="Пользователи" description="Управление базой данных персонала"><PersonalList/> </TemplatePage> 
    )
}

export default PersonalPage;