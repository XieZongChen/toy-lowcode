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

      if (!config?.component) {
        return null;
      }

      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        // components 是一个树形结构，这里要递归渲染 children
        renderComponents(component.children || [])
      );
    });
  }

  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    // composedPath 是从触发事件的元素到 html 根元素的路径
    // 使用 nativeEvent 而不是直接使用 e.composedPath 是因为后者是合成事件，有的原生事件的属性它没有
    const path = e.nativeEvent.composedPath();

    // 沿 path 向上查找
    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      // 找到第一个有 data-component-id 的元素，就是当前鼠标 hover 的组件
      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
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
      {hoverComponentId && (
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
