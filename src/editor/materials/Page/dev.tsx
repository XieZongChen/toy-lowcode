import { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from '@/editor/hooks/useMaterialDrop';

function Page({ id, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(
    ['Button', 'Container', 'Modal', 'Table', 'Form'],
    id
  );

  return (
    <div
      data-component-id={id}
      ref={drop as unknown as (instance: HTMLDivElement | null) => void}
      className='p-[20px] h-[100%] box-border'
      style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
    >
      {children}
    </div>
  );
}

export default Page;
