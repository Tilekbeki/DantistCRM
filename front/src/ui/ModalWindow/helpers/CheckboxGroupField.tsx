import { Form, Checkbox } from 'antd';

//вспомогательный компонент для отрисовки чекбоксов
const CheckboxGroupField = ({ field }) => {
  const { checkboxes, title } = field;

  return (
    <Form.Item
      className={styles.lableTitle}
      key={field.name}
      name={field.name}
      label={title}
      colon={false}
      rules={field.rules}
    >
      <Checkbox.Group
        style={{ fontWeight: '400' }}
        options={checkboxes.map((el) => ({
          label: el.label,
          value: el.value ?? el.label,
        }))}
      />
    </Form.Item>
  );
};

export default CheckboxGroupField;