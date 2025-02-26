import { useEffect, useState } from 'react';
import { Select, TreeSelect } from 'antd';
import {
  Component,
  getComponentById,
  useComponentsStore,
} from '@/editor/stores/components';
import { useComponentConfigStore } from '@/editor/stores/component-config';

export interface ComponentMethodConfig {
  type: 'componentMethod';
  config: {
    componentId: number;
    method: string;
  };
}

export interface ComponentMethodProps {
  value?: string;
  onChange?: (config: ComponentMethodConfig) => void;
}

export function ComponentMethod(props: ComponentMethodProps) {
  const { components, curComponentId } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [selectedComponent, setSelectedComponent] =
    useState<Component | null>();

  function componentChange(value: number) {
    if (!curComponentId) return;

    setSelectedComponent(getComponentById(value, components));
  }

  return (
    <div className='mt-[40px]'>
      <div className='flex items-center gap-[10px]'>
        <div>组件：</div>
        <div>
          <TreeSelect
            style={{ width: 500, height: 50 }}
            treeData={components}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            onChange={(value) => {
              componentChange(value);
            }}
          />
        </div>
      </div>
      {componentConfig[selectedComponent?.name || ''] && (
        <div className='flex items-center gap-[10px] mt-[20px]'>
          <div>方法：</div>
          <div>
            <Select
              style={{ width: 500, height: 50 }}
              options={componentConfig[
                selectedComponent?.name || ''
              ].methods?.map((method) => ({
                label: method.label,
                value: method.name,
              }))}
              onChange={(value) => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
