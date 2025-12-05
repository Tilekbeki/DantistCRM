import { Button, Modal, Form } from 'antd';
import type { FC } from 'react';

import type { FieldType } from '../types/types';
import FieldRenderer from './helpers/FieldRenderer';

interface FormModalProps {
  title: string;
  buttonTitle: string;
  fields: FieldType[];
  open: boolean;
  buttonText: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: object) => void;
  defaultValues?: Record<string, any>; 
  hasDefaultValue: boolean;
}

const BaseAdminModal: FC<FormModalProps> = ({
  title,
  fields,
  onSubmit,
  open,
  onOpenChange,
  buttonText,
  defaultValues = {}, 
  hasDefaultValue = false,
}) => {
  const [form] = Form.useForm();

  const onFinish = (data: object) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Modal
      title={title}
      open={open}
      centered
      onCancel={() => onOpenChange(false)}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={defaultValues} // ⭐ ключ для редактирования
      >
        {fields.map((field) => (
          <div key={field.name}>
            <FieldRenderer field={field} hasDefaultValue={hasDefaultValue} />
          </div>
        ))}

        <Form.Item noStyle>
          <Button htmlType="submit" type="primary">
            {buttonText}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseAdminModal;
