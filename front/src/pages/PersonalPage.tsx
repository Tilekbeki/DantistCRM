
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
      console.log('Данные для создания персонала:', data);
      const { confirmPassword, ...staffData } = data;
      console.log('Данные для создания персонала:', staffData);
      console.log('Подтверждение пароля:', confirmPassword);

      const result = await createPersonal({...staffData, dateOfBirth: dayjs(+staffData.dateOfBirth).format('YYYY-MM-DD')}).unwrap();
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
              />
        </TemplatePage> 
    )
}

export default PersonalPage;