import { useEffect } from 'react';
import { useComponentsStore } from '../stores/components';

export function EditArea() {
  const { components, addComponent } = useComponentsStore();

  useEffect(() => {
    addComponent(
      {
        id: 222,
        name: 'Container',
        props: {},
        children: [],
      },
      1
    );
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  );
}
