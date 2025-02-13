import { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from '@/editor/hooks/useMaterialDrop';

const Container = ({ id, children }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);

  return (
    <div
      data-component-id={id}
      ref={drop as unknown as (instance: HTMLDivElement | null) => void}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
