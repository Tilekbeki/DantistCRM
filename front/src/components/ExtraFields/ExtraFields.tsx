import { PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import FieldRenderer from '../../ui/ModalWindow/helpers/FieldRenderer';


const ExtraFields = ({ fields: extraFields }) => {
  return (
    <div>
      <Form.List name="extraFields">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ key, name: fieldName }) => (
                <div key={key} className={styles.extraFields}>
                  <button className={styles.closeIcon} onClick={() => remove(fieldName)}>
                    <CloseIcon />
                  </button>

                  {extraFields.map((field) => (
                    <FieldRenderer field={field} extraFieldName={[fieldName, field.name]} />
                  ))}
                </div>
              ))}

              <Form.Item>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => {
                    add({});
                  }}
                >
                  Добавить сидения <PlusOutlined className={styles.plusIcon} />
                </button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </div>
  );
};

export default ExtraFields;