import React, { useEffect, useMemo, useRef } from 'react';
import { Form as AntdForm, Input } from 'antd';
import { useDrag } from 'react-dnd';
import { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from '@/editor/hooks/useMaterialDrop';

function Form({ id, name, children, onFinish }: CommonComponentProps) {
  const [form] = AntdForm.useForm();

  const { canDrop, drop } = useMaterialDrop(['FormItem'], id);

  const divRef = useRef<HTMLDivElement>(null);

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      id: id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  const formItems = useMemo(() => {
    return React.Children.map(children, (item: any) => {
      return {
        label: item.props?.label,
        name: item.props?.name,
        type: item.props?.type,
        id: item.props?.id,
      };
    });
  }, [children]);

  return (
    <div
      className={`w-[100%] p-[20px] min-h-[100px] ${
        canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
      }`}
      ref={divRef}
      data-component-id={id}
    >
      <AntdForm
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={(values) => {
          onFinish?.(values);
        }}
      >
        {formItems.map((item: any) => {
          return (
            <AntdForm.Item
              key={item.name}
              data-component-id={item.id}
              name={item.name}
              label={item.label}
            >
              {/* dev 不需要输入内容 */}
              <Input style={{ pointerEvents: 'none' }} />
            </AntdForm.Item>
          );
        })}
      </AntdForm>
    </div>
  );
}

export default Form;
