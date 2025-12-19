import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const LoginForm = () => {
  return (
    <Form
      name="basic"
      // Убрали labelCol и wrapperCol здесь
      className="flex flex-col max-w-[600px] bg-white rounded-[20px] min-h-[100px] p-[40px] justify-center items-start"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>>
        <h1 className='text-3xl font-bold'>Вход</h1>
      </Form.Item>
      
      <Form.Item<FieldType>
        label="Логин"
        name="username"
        required={false}
        rules={[{ required: true, message: 'Пожалуйста, введите ваш логин!' }]}
        // Добавляем классы для выравнивания слева
        className="w-full mb-4"
        labelCol={{ span: 24 }} // label на всю ширину
        wrapperCol={{ span: 24 }} // input на всю ширину
      >
        <Input className="w-full" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        required={false}
        rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
        className="w-full mb-4"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password className="w-full" />
      </Form.Item>

      <Form.Item<FieldType> 
        name="remember" 
        valuePropName="checked" 
        label={null}
        className="w-full"
      >
        <Checkbox>Запомнить меня</Checkbox>
      </Form.Item>

      <Form.Item label={null} className="w-full">
        <Button 
          type="primary" 
          htmlType="submit"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;