import { Button, Modal, Form } from 'antd';
import type { FC } from 'react';

import type { FieldType } from '../types/types';

import FieldRenderer from './helpers/FieldRenderer';

interface FormModalProps {
  title: string;
  buttonTitle: string;
  fields: FieldType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: object) => void;
}

const BaseAdminModal: FC<FormModalProps> = ({ title, fields, onSubmit, open, onOpenChange }) => {

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
      <Form onFinish={onFinish} >
        {fields.map((field) => (
          <div key={field.name}>
            <FieldRenderer field={field} />
          </div>
        ))}

        <Form.Item noStyle>
          <Button  htmlType="submit" type="primary">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BaseAdminModal;