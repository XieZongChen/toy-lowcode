import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from '@/editor/hooks/useMaterialDrop';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);

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

  return (
    <div
      data-component-id={id}
      ref={divRef}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'
      }`}
      style={styles}
    >
      {children}
    </div>
  );
};

export default Container;
