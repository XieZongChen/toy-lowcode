import { Collapse, Input, Select, CollapseProps } from 'antd';
import { useComponentsStore } from '@/editor/stores/components';
import { useComponentConfigStore } from '@/editor/stores/component-config';

export function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  if (!curComponent) return null;

  const items: CollapseProps['items'] = (
    componentConfig[curComponent.name].events || []
  ).map((event) => {
    return {
      key: event.name,
      label: event.label,
      children: (
        <div>
          <div className='flex items-center'>
            <div>动作：</div>
            <Select
              className='w-[160px]'
              options={[
                { label: '显示提示', value: 'showMessage' },
                { label: '跳转链接', value: 'goToLink' },
              ]}
              value={curComponent?.props?.[event.name]?.type}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <div className='px-[10px]'>
      <Collapse className='mb-[10px]' items={items} />
    </div>
  );
}
