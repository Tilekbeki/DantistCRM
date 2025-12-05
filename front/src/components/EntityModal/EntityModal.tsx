import type { FC } from "react";
import BaseAdminModal from "../../ui/ModalWindow/ModalWindow";

interface EntityModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fields: any[];
  title: string;
  onSubmit: (values: any) => void;
  buttonText?: string;
  buttonTitle?: string;
  defaultValues?: Record<string, any>;
  hasDefaultValue?: boolean;
}

const EntityModal: FC<EntityModalProps> = ({
  open,
  onOpenChange,
  fields,
  title,
  onSubmit,
  buttonText = "Сохранить",
  buttonTitle = "",
  defaultValues = {},
  hasDefaultValue=false,
}) => {
  console.log(defaultValues)
  return (
    <BaseAdminModal
      title={title}
      fields={fields}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      buttonText={buttonText}
      buttonTitle={buttonTitle}
      hasDefaultValue={hasDefaultValue}
    />
  );
};

export default EntityModal;
