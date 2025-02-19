import { Form, Input, InputNumber, Select } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import { debounce } from 'lodash-es';
import styleToObject from 'style-to-object';
import { useComponentsStore } from '@/editor/stores/components';
import {
  ComponentSetter,
  useComponentConfigStore,
} from '@/editor/stores/component-config';
import CssEditor from './CssEditor';

export function ComponentStyle() {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    } else if (type === 'inputNumber') {
      return <InputNumber />;
    }
  }

  function valueChange(changeValues: CSSProperties) {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  }

  const handleEditorChange = debounce((value) => {
    const css: Record<string, any> = {};

    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', ''); // 去掉 }

      styleToObject(cssStr, (name, value) => {
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))
        ] = value;
      });

      updateComponentStyles(
        curComponentId,
        { ...form.getFieldsValue(), ...css },
        true
      );
    } catch (e) {
      console.error(e);
    }
  }, 500);

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {componentConfig[curComponent.name]?.stylesSetter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
      <div className='h-[200px] border-[1px] border-[#ccc]'>
        <CssEditor value={`.comp{\n\n}`} onChange={handleEditorChange} />
      </div>
    </Form>
  );
}
