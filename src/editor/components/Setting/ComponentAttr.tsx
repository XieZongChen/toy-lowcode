import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useComponentsStore } from '@/editor/stores/components';
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from '@/editor/stores/component-config';

export function ComponentAttr() {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    // 回显设置
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.props });
  }, [curComponent]);

  // 没有选中组件的时候本组件没有内容
  if (!curComponentId || !curComponent) return null;

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    if (curComponentId) {
      // 同步数据
      updateComponentProps(curComponentId, changeValues);
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label='组件id'>
        <Input value={curComponent.id} disabled />
      </Form.Item>
      <Form.Item label='组件名称'>
        <Input value={curComponent.name} disabled />
      </Form.Item>
      <Form.Item label='组件描述'>
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[curComponent.name]?.setter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
}
