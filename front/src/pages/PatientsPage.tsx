import PatientsList from "../components/PatientsList";
import TemplatePage from "./TemplatePage";

const PatientsPage = () => {
     const handleClick = (e) => {
      console.log(e);             // SyntheticEvent
    console.log(e.nativeEvent);
  }
    return (
     
        <TemplatePage title="Пациенты" description="Управление базой данных пациентов"><PatientsList/> </TemplatePage> 
    )
}

export default PatientsPage;