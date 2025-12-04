
import PersonalList from "../components/PersonalList";
import TemplatePage from "./TemplatePage";

const PersonalPage = () => {
    const toggleModalState = () => {
    console.log('clicked');
    setIsModalOpen(!isModalOpen);
  };
    return (
     
        <TemplatePage title="Пользователи" description="Управление базой данных персонала" toggleModalState={toggleModalState}><PersonalList/> </TemplatePage> 
    )
}

export default PersonalPage;