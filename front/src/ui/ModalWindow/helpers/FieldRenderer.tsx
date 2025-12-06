import { Form, Input, InputNumber, DatePicker, Select, Checkbox } from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';

import ExtraFields from '../../../components/ExtraFields';
import type { FieldType } from '../../types/types';

import CheckboxGroupField from './CheckboxGroupField';
interface FieldRendererProps {
  field: FieldType;
  extraFieldName?: string;
  hasDefaultValue: boolean;
}

const FieldRenderer: FC<FieldRendererProps> = ({ field, extraFieldName, hasDefaultValue = false }) => {
  switch (field.type) {
    case 'checkbox':
      return (
        <>
          {field.title && <div>{field.title}</div>}
          <Form.Item name={extraFieldName ? extraFieldName : field.name} valuePropName="checked" rules={field.rules}>
            <Checkbox>{field.label}</Checkbox>
          </Form.Item>
        </>
      );

    case 'checkboxGroup':
      return <CheckboxGroupField field={field} extraFieldName={extraFieldName} />;

    case 'select':
      return (
        <Form.Item
          label={field.label}
          name={extraFieldName ? extraFieldName : field.name}
          colon={false}
          initialValue={field.options?.[0]?.value}
        >
          <Select options={field.options} />
        </Form.Item>
      );

    case 'input-number':
      return (
        <Form.Item
          name={extraFieldName ? extraFieldName : field.name}
          rules={field.rules}
          label={field.label}
          colon={false}
          required={false}
        >
          <InputNumber placeholder={field.placeholder} />
        </Form.Item>
      );

    case 'button-create-fields':
      return <ExtraFields name={field.arrayName} fields={field.extraFields} />;

    case 'data-time':
      return (
        <Form.Item
          label={field.label}
          name={extraFieldName ? extraFieldName : field.name}
          colon={false}
          required={false}
          rules={field.rules}
          {...(field.dependencies ? { dependencies: field.dependencies } : null)}
          getValueProps={(value) => ({
            value: value ? dayjs(Number(value)) : undefined,
          })}
          normalize={(value) => (value && dayjs(value).isValid() ? `${dayjs(value).valueOf()}` : undefined)}
        >
          <DatePicker
            {...(field.format === 'DD.MM.YYYY HH:mm' ? { showTime: true } : null)}
            placeholder={
              field.format === 'YYYY' ? 'ГГГГ' : field.format === 'DD.MM.YYYY' ? 'ДД.ММ.ГГГГ' : 'ДД:ММ:ГГГГ ЧЧ:ММ'
            }
            {...(field.picker ? { picker: field.picker } : null)}
            format={field.format}
            {...(field.styled ? { suffixIcon: '' } : null)}
            style={{ borderRadius: '0' }}
          />
        </Form.Item>
      );

    default:
      if (field.editableByOnlyUser && hasDefaultValue) {
        return null;
      } else {
        return (
          <Form.Item
            name={extraFieldName ? extraFieldName : field.name}
            rules={field.rules}
            label={field.label}
            {...(field.dependencies ? { dependencies: field.dependencies } : null)}
            colon={false}
            required={false}
          >
            <Input type={field.type} placeholder={field.placeholder} />
          </Form.Item>
        );
      }
  }
};

export default FieldRenderer;
