import { useDrop } from 'react-dnd';
import { CommonComponentProps } from '@/editor/interface';
import { useComponentConfigStore } from '@/editor/stores/component-config';
import { useComponentsStore } from '@/editor/stores/components';

function Page({ id, name, children }: CommonComponentProps) {
  const { addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ['Button', 'Container'],
    drop: (item: { type: string }) => {
      const props = componentConfig[item.type].defaultProps;

      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          props,
        },
        id
      );
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as (instance: HTMLDivElement | null) => void}
      className='p-[20px] h-[100%] box-border'
      style={{ border: canDrop ? '2px solid blue' : 'none' }}
    >
      {children}
    </div>
  );
}

export default Page;
