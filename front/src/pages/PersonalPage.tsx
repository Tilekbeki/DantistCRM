
import PersonalList from "../components/PersonalList";
import TemplatePage from "./TemplatePage";
import { personFields } from "../components/Fields/personalField";
import EntityModal from "../components/EntityModal/EntityModal";
import { useCreatePersonalMutation } from "../store/services/PersonalApi";
import { useState } from "react";
import dayjs from "dayjs";

const PersonalPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createPersonal, { isLoading }] = useCreatePersonalMutation(); // Правильное использование хука
    

  
    const handleOk = async (data: any) => {
      
      const { confirmPassword,dateOfBirth,experience, ...staffData } = data;
      console.log('Данные для созданияzzzz персонала:', {experience: +experience,
        dateOfBirth: dayjs(+dateOfBirth).format('YYYY-MM-DD'),
        ...staffData});
      console.log('Данные для создания персонала:', staffData);
      console.log('Подтверждение пароля:', confirmPassword);

      const result = await createPersonal({experience: +experience,
        dateOfBirth: dayjs(+dateOfBirth).format('YYYY-MM-DD'),
        ...staffData}).unwrap()
      if (result.data?.createPersonal?.success) {
        setIsModalOpen(false);
        alert('Пациент успешно создан!');
      } else {
        alert(`Ошибка: ${result.data?.createPersonal?.message || 'Неизвестная ошибка'}`);
      }
    }

    const toggleModalState = () => {
      console.log('clicked');
      setIsModalOpen(!isModalOpen);
    };

    return (
     
        <TemplatePage title="Персонал" description="Управление базой данных персонала" toggleModalState={toggleModalState}><PersonalList/> 
        <EntityModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="Создание Персонала"
                fields={personFields}
                buttonText="Создать"
                onSubmit={handleOk}
                isLoading={isLoading} // Передаем состояние загрузки в модалку
                hasDefaultValue={false}
              />
        </TemplatePage> 
    )
}

export default PersonalPage;