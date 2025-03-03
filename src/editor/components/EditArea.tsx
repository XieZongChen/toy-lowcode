import React, { MouseEventHandler, useState } from 'react';
import { Component, useComponentsStore } from '../stores/components';
import { useComponentConfigStore } from '../stores/component-config';
import HoverMask from './HoverMask';
import SelectedMask from './SelectedMask';

export function EditArea() {
  const { components, curComponentId, setCurComponentId } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.dev) {
        return null;
      }

      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.getDefaultProps(),
          ...component.props,
        },
        // components 是一个树形结构，这里要递归渲染 children
        renderComponents(component.children || [])
      );
    });
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    // 获取带有 data-component-id 属性的最近的祖先元素
    const target = (e.target as HTMLElement).closest('[data-component-id]');
    if (target) {
      // 如果存在，则取到 data-component-id 属性的值
      const componentId = target.getAttribute('data-component-id');
      if (componentId) {
        // 如果有值，则转化为 Number 后设置到 hover id 内
        setHoverComponentId(Number(componentId));
      }
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setCurComponentId(+componentId);
        return;
      }
    }
  };

  return (
    <div
      className='h-[100%] edit-area'
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setHoverComponentId(undefined)}
      onClick={handleClick}
    >
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          portalWrapperClassName='portal-wrapper'
          containerClassName='edit-area'
          componentId={hoverComponentId}
        />
      )}
      {curComponentId && (
        <SelectedMask
          portalWrapperClassName='portal-wrapper'
          containerClassName='edit-area'
          componentId={curComponentId}
        />
      )}
      <div className='portal-wrapper'></div>
    </div>
  );
}
