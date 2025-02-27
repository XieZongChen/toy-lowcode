import { Ref } from 'react';
import { Button as AntdButton } from 'antd';
import { useDrag } from 'react-dnd';
import { CommonComponentProps } from '@/editor/interface';

const Button = ({ id, type, text, styles }: CommonComponentProps) => {
  const [_, drag] = useDrag({
    type: 'Button',
    item: {
      type: 'Button',
      dragType: 'move',
      id: id,
    },
  });

  return (
    <AntdButton
      ref={drag as unknown as Ref<HTMLButtonElement | HTMLAnchorElement>}
      data-component-id={id}
      type={type}
      style={styles}
    >
      {text}
    </AntdButton>
  );
};

export default Button;
