import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '@/editor/interface';

const Button = ({ id, type, text }: CommonComponentProps) => {
  return (
    <AntdButton data-component-id={id} type={type}>
      {text}
    </AntdButton>
  );
};

export default Button;
