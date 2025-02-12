import { useMemo } from 'react';
import { useComponentConfigStore } from '../stores/component-config';

export function Material() {
  const { componentConfig } = useComponentConfigStore();

  const components = useMemo(() => {
    return Object.values(componentConfig);
  }, [componentConfig]);

  return (
    <div>
      {components.map((item) => {
        return (
          <div
            className='
                    border-dashed
                    border-[1px]
                    border-[#000]
                    py-[8px] px-[10px] 
                    m-[10px]
                    cursor-move
                    inline-block
                    bg-white
                    hover:bg-[#ccc]
                '
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
}
