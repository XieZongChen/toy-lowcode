import { useState } from 'react';
import { Collapse, CollapseProps, Button } from 'antd';
import { useComponentConfigStore } from '@/editor/stores/component-config';
import type { ComponentEvent } from '@/editor/stores/component-config';
import { useComponentsStore } from '@/editor/stores/components';
import { GoToLinkConfig } from './actions/GoToLink';
import { ShowMessageConfig } from './actions/ShowMessage';
import { ActionModal } from './ActionModal';

export function ComponentEvent() {
  const { curComponent, updateComponentProps } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();

  if (!curComponent) return null;

  const items: CollapseProps['items'] = (
    componentConfig[curComponent.name].events || []
  ).map((event) => {
    return {
      key: event.name,
      label: (
        <div className='flex justify-between leading-[30px]'>
          {event.label}
          <Button
            type='primary'
            onClick={() => {
              setCurEvent(event);
              setActionModalOpen(true);
            }}
          >
            添加动作
          </Button>
        </div>
      ),
      children: <div></div>,
    };
  });

  function handleModalOk(config?: GoToLinkConfig | ShowMessageConfig) {
    if (!config || !curEvent || !curComponent) {
      return;
    }

    updateComponentProps(curComponent.id, {
      [curEvent.name]: {
        actions: [
          ...(curComponent.props[curEvent.name]?.actions || []),
          config,
        ],
      },
    });

    setActionModalOpen(false);
  }

  return (
    <div className='px-[10px]'>
      <Collapse className='mb-[10px]' items={items} />
      <ActionModal
        visible={actionModalOpen}
        handleOk={handleModalOk}
        handleCancel={() => {
          setActionModalOpen(false);
        }}
      />
    </div>
  );
}
